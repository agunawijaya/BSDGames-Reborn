class Settings {
  constructor() {
    this.widthInput = document.getElementById('boardWidth');
    this.heightInput = document.getElementById('boardHeight');
    this.presetSelect = document.getElementById('presetSelect');
    this.garbageHeightInput = document.getElementById('garbageHeight');
    this.garbageHeightVal = document.getElementById('garbageHeightVal');
    this.garbageDensityInput = document.getElementById('garbageDensity');
    this.garbageDensityVal = document.getElementById('garbageDensityVal');
    this.modeSelect = document.getElementById('modeSelect');
    this.startLevelInput = document.getElementById('startLevel');

    this.presets = {
      normal: { width: 10, height: 20 },
      tower: { width: 6, height: 30 },
      canyon: { width: 10, height: 20 },
      wide: { width: 20, height: 16 },
      split: { width: 11, height: 20 },
      hourglass: { width: 12, height: 20 },
      donut: { width: 12, height: 20 },
      staircase: { width: 12, height: 20 }
    };

    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    this.presetSelect.addEventListener('change', () => this.applyPreset());

    this.garbageHeightInput.addEventListener('input', () => {
      this.garbageHeightVal.textContent = this.garbageHeightInput.value;
    });

    this.garbageDensityInput.addEventListener('input', () => {
      this.garbageDensityVal.textContent = this.garbageDensityInput.value + '%';
    });

    [this.widthInput, this.heightInput].forEach(el => {
      el.addEventListener('change', () => {
        this.presetSelect.value = 'normal';
      });
    });
  }

  applyPreset() {
    const key = this.presetSelect.value;
    const p = this.presets[key];
    this.widthInput.value = p.width;
    this.heightInput.value = p.height;
  }

  updateDisplay() {
    this.garbageHeightVal.textContent = this.garbageHeightInput.value;
    this.garbageDensityVal.textContent = this.garbageDensityInput.value + '%';
  }

  getConfig() {
    return {
      width: parseInt(this.widthInput.value, 10),
      height: parseInt(this.heightInput.value, 10),
      preset: this.presetSelect.value,
      garbageHeight: parseInt(this.garbageHeightInput.value, 10),
      garbageDensity: parseInt(this.garbageDensityInput.value, 10) / 100,
      mode: this.modeSelect.value,
      startLevel: parseInt(this.startLevelInput.value, 10)
    };
  }
}
