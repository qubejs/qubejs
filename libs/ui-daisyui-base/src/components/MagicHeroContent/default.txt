import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, Scene } from 'react-scrollmagic';
import styled from 'styled-components';
import { Tween, Timeline } from 'react-gsap';

const SectionWipes2Styled = styled.div`
  overflow: hidden;
  #pinContainer {
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  #pinContainer .panel {
    height: 100vh;
    width: 100%;
    position: absolute;
    text-align: center;
  }
  .panel span {
    position: relative;
    display: block;
    top: 50%;
    font-size: 80px;
  }

  .panel.blue {
    background-color: #3883d8;
  }

  .panel.turqoise {
    background-color: #38ced7;
  }

  .panel.green {
    background-color: #22d659;
  }

  .panel.bordeaux {
    background-color: #953543;
  }
`;

const MagicHeroContentDefault = ({ className = '', duration = 600 }) => {
  return (
    <div className={`sq-magic-hero-content-default ${className}`}>
      <SectionWipes2Styled>
        <Controller>
          <Scene triggerHook="onLeave" duration="300%" pin>
            <Timeline wrapper={<div id="pinContainer" />}>
              <section className="panel blue">
                <span>Panel</span>
              </section>
              <Tween from={{ x: '-100%' }} to={{ x: '0%' }}>
                <section className="panel turqoise">
                  <span>Panel</span>
                </section>
              </Tween>
              <Tween from={{ x: '100%' }} to={{ x: '0%' }}>
                <section className="panel green">
                  <span>Panel</span>
                </section>
              </Tween>
              <Tween from={{ y: '-100%' }} to={{ y: '0%' }}>
                <section className="panel bordeaux">
                  <span>Panel</span>
                </section>
              </Tween>
            </Timeline>
          </Scene>
        </Controller>
      </SectionWipes2Styled>
    </div>
  );
};

MagicHeroContentDefault.propTypes = {
  items: PropTypes.array
};

export default MagicHeroContentDefault;
