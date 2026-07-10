/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynth {
  constructor() {}

  public setEnabled(enabled: boolean) {}

  public getEnabled(): boolean {
    return false;
  }

  public playClick() {}
  public playPop() {}
  public playTick() {}
}

export const audioSynth = new AudioSynth();
