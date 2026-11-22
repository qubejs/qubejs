import { Component } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { utils } from '@qubejs/web-react';

gsap.registerPlugin(ScrollTrigger);

const presetAnimation = {
  sliderWithScrub: {},
};

class MagicHeroContentDefault extends Component {
  static propTypes: any;
  props: any;
  allTweens: any;
  tObj: any;
  tlObj: any;
  trigger: any;
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTarget(target) {
    const { name } = this.props;
    if (target && target.rule) {
      return CSSRulePlugin.getRule(target.rule);
    }
    return (name ? '.' + name + ' ' : '') + target;
  }

  applyTweens(tweens, timeline?) {
    this.allTweens = [];
    tweens.forEach((tween) => {
      const { target, start, ...restTween } = tween;
      if (restTween.from && restTween.to) {
        this.allTweens.push(
          (timeline || gsap).fromTo(
            this.getTarget(target),
            restTween.from,
            restTween.to,
            start
          )
        );
      } else if (restTween.from) {
        this.allTweens.push(
          (timeline || gsap).from(this.getTarget(target), restTween.from, start)
        );
      } else if (restTween.to) {
        this.allTweens.push(
          (timeline || gsap).to(this.getTarget(target), restTween.to, start)
        );
      }
    });
  }

  getTimeline() {
    let { timeline }:any = this.props;
    const { tweens, animation }:any = this.props;
    if (presetAnimation[animation]) {
      timeline = presetAnimation[animation];
    }
    return { tweens, timeline };
  }

  componentDidMount() {
    const { tweens, timeline } = this.getTimeline();
    const { tweens: tlTweens = [], ...restTimeline } = JSON.parse(
      JSON.stringify(timeline || {})
    );
    if (timeline) {
      this.tlObj = gsap.timeline(restTimeline);
      this.trigger = restTimeline.trigger;
      tlTweens && this.applyTweens(tlTweens, this.tlObj);
    }
    tweens && this.applyTweens(tweens);
    setTimeout(() => {
      restTimeline?.scrollTrigger && ScrollTrigger.refresh();
    }, 500);
  }
  componentWillUnmount() {
    this.killAll();
  }

  killAll() {
    this.allTweens?.forEach((tween) => {
      tween && tween.kill(true);
    });
    this.tlObj?.scrollTrigger && this.tlObj.scrollTrigger.kill(true);
    this.tlObj?.pause(0).kill(true);
    this.tlObj = null;
  }

  render() {
    const { name, content = {}, className = '', ...restProps } = this.props;
    const { component, ...restContent } = content;
    const compMap = utils.storage.components.get();
    const CmpToRender = compMap[component] || compMap.HeroContent;
    if (!CmpToRender) {
      console.log(`"${CmpToRender}" component doesn't exists`);
      return <></>;
    }
    return (
      <div className={`sq-magic-hero-content-pencil ${className} ${name}`}>
        <CmpToRender {...restProps} {...restContent} />
      </div>
    );
  }
}

MagicHeroContentDefault.propTypes = {
  items: PropTypes.array,
};

export default MagicHeroContentDefault;
