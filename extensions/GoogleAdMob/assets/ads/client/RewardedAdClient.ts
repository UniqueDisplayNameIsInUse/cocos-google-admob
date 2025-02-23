import { log } from "cc";
import { bridge } from "../../core/Bridge";
import { LoadRewardedAdACK, LoadRewardedAdREQ, OnUserEarnedRewardListenerNTF, RewardedAdLoadCallbackNTF, RewardedFullScreenContentCallbackNTF, ShowRewardedAdACK, ShowRewardedAdREQ } from "../../proto/RewardedAd";
import { AdClient } from "./AdClient";
import { route } from "../../core/Route";
import { OnUserEarnedRewardListener } from "../listener/OnUserEarnedRewardListener";
import { RewardedAdListener } from "../listener/RewardedAdListener";
import { RewardedPaidEventNTF } from "../../proto/PaidEventNTF";
import { OnPaidEventListener } from "../listener/OnPaidEventListener";
import { js } from "cc";

/**
 * @zh
 * 激励广告 Rewarded Ad 客户端
 * @en
 * The rewarded ad client
 */
const module = "[RewardedAdClient]"
export class RewardedAdClient extends AdClient {

    /**
     * @zh
     * 激励广告监听器的联合类型
     * @en
     * Union of listeners for rewarded ad.
     */
    private _rewardedListener: RewardedAdListener;

    /**
     * @zh
     * 激励广告监听器的联合类型
     * @en
     * Union of listeners for rewarded ad.
     */
    public set rewardedListener(value: RewardedAdListener) {
        if (this._rewardedListener) {
            route.off(js.getClassName(RewardedAdLoadCallbackNTF), this.onRewardedAdLoadCallbackNTF, this);
            route.off(js.getClassName(RewardedFullScreenContentCallbackNTF), this.onFullScreenContentCallback, this);
            route.off(js.getClassName(OnUserEarnedRewardListenerNTF), this.onOnUserEarnedRewardListenerNTF, this);
            route.off(js.getClassName(RewardedPaidEventNTF), this.onPaidEvent, this);
        }
        this._rewardedListener = value;

        if (this._rewardedListener) {
            route.on(js.getClassName(RewardedAdLoadCallbackNTF), this.onRewardedAdLoadCallbackNTF, this);
            route.on(js.getClassName(RewardedFullScreenContentCallbackNTF), this.onFullScreenContentCallback, this);
            route.on(js.getClassName(OnUserEarnedRewardListenerNTF), this.onOnUserEarnedRewardListenerNTF, this);
            route.on(js.getClassName(RewardedPaidEventNTF), this.onPaidEvent, this);
        }
    }
    
    /**
     * @zh
     * 激励广告监听器的联合类型
     * @en
     * Union of listeners for rewarded ad.
     */
    public get rewardedListener(): RewardedAdListener {
        return this._rewardedListener;
    }

    /**
     * @zh
     * 加载记录广告
     * @en
     * Load the rewarded ad
     * @param unitId 
     *  @zh 单元 Id
     *  @en the unit id
     * @param rewardedListener 
     *  @zh 监听器
     *  @en The rewarded ad listener
     */
    load(unitId: string, rewardedListener: RewardedAdListener) {
        log(module, `load, unitId = ${unitId}`);
        this.unitId = unitId;
        this.rewardedListener = rewardedListener;
        bridge.sendToNative(js.getClassName(LoadRewardedAdREQ), { unitId: unitId }, js.getClassName(LoadRewardedAdACK), (ack: LoadRewardedAdACK) => {
            log(module, `LoadRewardedAdACK, ${ack}`);
        }, this);
    }

    /**
     * @zh
     * 销毁事件监听
     * @en
     * Deregister ad listener
     */
    destroy() {
        log(module, `destroy`);
        this.rewardedListener = null;
    }

    /**
     * @zh
     * 展示激励广告
     * @en
     * Show the rewarded ad.
     */
    show() {
        log(module, `show`);
        bridge.sendToNative(js.getClassName(ShowRewardedAdREQ), { unitId: this.unitId }, js.getClassName(ShowRewardedAdACK), (ack: ShowRewardedAdACK) => {
            log(module, `ShowRewardedAdREQ, ${ack}`);            
        }, this);
    }

    private onRewardedAdLoadCallbackNTF(ntf: RewardedAdLoadCallbackNTF) {
        log(module, `onRewardedAdLoadCallbackNTF`);
        if (this.rewardedListener) {
            const method = this.rewardedListener[ntf.method]
            if (method) {
                method();
            }
        }
    }

    private onFullScreenContentCallback(ntf: RewardedFullScreenContentCallbackNTF) {
        log(module, `onFullScreenContentCallback`);
        if (this.rewardedListener) {
            let method = this.rewardedListener[ntf.method];
            if (method) {
                method(ntf.adError);
            }
        }
    }

    private onOnUserEarnedRewardListenerNTF(ntf: OnUserEarnedRewardListenerNTF) {
        log(module, `onOnUserEarnedRewardListenerNTF`);
        if (this.rewardedListener) {
            const onUserEarnedRewardListener: OnUserEarnedRewardListener = this.rewardedListener as OnUserEarnedRewardListener;
            if (onUserEarnedRewardListener && onUserEarnedRewardListener.onEarn) {
                onUserEarnedRewardListener.onEarn(ntf.rewardType, ntf.rewardAmount);
            }
        }
    }

    private onPaidEvent(ntf: RewardedPaidEventNTF) {
        const paid = this.rewardedListener as OnPaidEventListener<RewardedPaidEventNTF>;
        if (paid && paid.onPaidEvent) {
            paid.onPaidEvent(ntf);
        }
    }
}