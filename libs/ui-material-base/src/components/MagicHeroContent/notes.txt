import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { Controls, PlayState, Timeline, Tween } from 'react-gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';
import HeroContent from '../HeroContent';

gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(CSSRulePlugin);

const compMap = {
  HeroContent
};

class MagicHeroContentDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // getTarget(target) {
  //   const { name } = this.props;
  //   if (target && target.rule) {
  //     return CSSRulePlugin.getRule(target.rule);
  //   }
  //   return (name ? '.' + name + ' ' : '') + target;
  // }

  // applyTweens(tweens, timeline) {
  //   this.allTweens = [];
  //   tweens.forEach((tween) => {
  //     const { target, ...restTween } = tween;
  //     if (restTween.from) {
  //       this.allTweens.push((timeline || gsap).from(this.getTarget(target), restTween.from));
  //     }
  //     if (restTween.to) {
  //       this.allTweens.push((timeline || to).to(this.getTarget(target), restTween.to));
  //     }
  //   });
  // }

  // componentDidMount() {
  //   const { tweens, timeline } = this.props;
  //   if (timeline) {
  //     const { tweens: tlTweens = [], ...restTimeline } = timeline;
  //     this.tlObj = gsap.timeline(restTimeline);
  //     tlTweens && this.applyTweens(tlTweens, this.tlObj);
  //   }
  //   tweens && this.applyTweens(tweens);
  // }
  // componentWillUnmount() {
  //   this.allTweens.forEach((tween) => {
  //     tween && tween.kill();
  //   });
  //   this.tlObj.kill();
  // }

  render() {
    const { content = {}, className = '', classes = {} } = this.props;
    const { tweens, timeline = {} } = this.props;
    const { tweens: tlTweens = [], ...restTimeline } = timeline;
    const finalTweens = tlTweens.length > 0 ? tlTweens : tweens;

    //   tweens && this.applyTweens(tweens);
    const { component, ...restContent } = content;
    const CmpToRender = compMap[component] || compMap.HeroContent;
    return (
      <div className={`sq-magic-hero-content-pencil`}>
        <Timeline target={<CmpToRender {...restContent} />} {...restTimeline}>
          {finalTweens &&
            finalTweens.map((item) => {
              return <Tween {...item} />;
            })}
        </Timeline>
      </div>
    );
  }
}

MagicHeroContentDefault.propTypes = {
  items: PropTypes.array
};

export default MagicHeroContentDefault;
