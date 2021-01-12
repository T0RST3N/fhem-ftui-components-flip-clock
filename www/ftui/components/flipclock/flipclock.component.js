/*
* FlipClock component for FTUI version 3
* based on clock component from Mario Stephan <mstephan@shared-files.de>
* Copyright (c) 2020 Mario Stephan <mstephan@shared-files.de>
* Copyright (c) 2020 Torsten Rywelski <torsten.rywelski@gmail.com>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
* https://git.rywelski.de/FHEM/ftui_components_flipclock
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';
import { dateFormat } from '../../modules/ftui/ftui.helper.js';

export class FtuiFlipClock extends FtuiElement {

  constructor(properties) {

    super(Object.assign(FtuiFlipClock.properties, properties));

	this.stime = [];
	this.dots();
    this.update();
    this.startInterval();
    this.setcolor(this.clockbg, this.clockfontcolor);
    this.getFhemTime();
  }

  template() {
    return `<style> @import "components/flipclock/flipclock.component.css"; </style>
	<div class="clock-container">
		<ul class="clockfl go one" style="display: none;">
			<li class="clock-before">
				<a href="#">
				<div class="up">
					<div class="shadow"></div>
				</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
			<li class="clock-active hourten">
				<a href="#">
					<div class="up">
						<div class="shadow"></div>
					</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
		</ul>
		<ul class="clockfl go two" style="display: none;">
			<li class="clock-before">
				<a href="#">
				<div class="up">
					<div class="shadow"></div>
				</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
			<li class="clock-active hourone">
				<a href="#">
					<div class="up">
						<div class="shadow"></div>
					</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
		</ul>
			<span class="clock-divider doth">
				<span class="clock-label"></span>
				<span class="clock-dot top"></span>
				<span class="clock-dot bottom"></span>
			</span>
		<ul class="clockfl go three" style="display: none;">
			<li class="clock-before">
				<a href="#">
				<div class="up">
					<div class="shadow"></div>
				</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
			<li class="clock-active ten">
				<a href="#">
					<div class="up">
						<div class="shadow"></div>
					</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
		</ul>
		<ul class="clockfl go four" style="display: none;">
			<li class="clock-before">
				<a href="#">
				<div class="up">
					<div class="shadow"></div>
				</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
			<li class="clock-active min">
				<a href="#">
					<div class="up">
						<div class="shadow"></div>
					</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
		</ul>
			<span class="clock-divider dots">
				<span class="clock-label"></span>
				<span class="clock-dot top"></span>
				<span class="clock-dot bottom"></span>
			</span>
		<ul class="clockfl go five" style="display: none;">
			<li class="clock-before">
				<a href="#">
				<div class="up">
					<div class="shadow"></div>
				</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
			<li class="clock-active ten">
				<a href="#">
					<div class="up">
						<div class="shadow"></div>
					</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
		</ul>
		<ul class="clockfl go six" style="display: none;">
			<li class="clock-before">
				<a href="#">
				<div class="up">
					<div class="shadow"></div>
				</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
			<li class="clock-active min">
				<a href="#">
					<div class="up">
						<div class="shadow"></div>
					</div>
					<div class="down">
						<div class="shadow"></div>
					</div>
				</a>
			</li>
		</ul>
		
	</div>`;
  }

  static get properties() {
    return {
      format: 'hh:mm:ss',
      serverDiff: 0,
      offset: 0,
      isFhemTime: false,
      clockbg: '#333',
      clockfontcolor: '#cccccc',
	  clocksize: 'normal'
    }
  }

  getFhemTime() {
    if (this.isFhemTime) {
      fhemService.sendCommand('{localtime}', '1')
        .then(res => res.text())
        .then((result) => {
          const fhemTime = new Date(result);
          this.serverDiff = Date.now() - fhemTime.getTime();
        });
    }
  }
  dots() {
	var i = this.format.length;
	if (i >= 3 && i <= 5 ) { 
		this.el = this.shadowRoot.querySelector('.dots'); 
		this.el.setAttribute("style", "display: none;");
	}
	if (i <= 2){
		this.el = this.shadowRoot.querySelector('.dots'); 
		this.el.setAttribute("style", "display: none;");
		this.el = this.shadowRoot.querySelector('.doth'); 
		this.el.setAttribute("style", "display: none;");
	}
  }

  update() {
	let time = [];
	let i = [];
	for( i = 0; i < dateFormat(this.getDateTime(), this.format).length; ++i) {
		time[i] = dateFormat(this.getDateTime(), this.format)[i];
		if (this.stime[i] != time[i]) {
			this.flip_card (i, parseInt(time[i]) + 20); 
		}
	}
	this.stime = time.slice();
  }
  // Setting Color
  setcolor (bg, fc){
	this.el = this.shadowRoot.querySelector('.clock-container');
	this.el.setAttribute("style", "--clock-flip-bg:" + bg + "; --clock-flip-font-color:" + fc + ";" );
	this.el.className += " " + this.clocksize;
  }
  // Flip the card
  flip_card(cl, digit){
	switch (cl){
		case 0:
			cl = '.one';
			break;
		case 1:
			cl = '.two';
			break;
		case 2:
			cl = '.three';
			break;
		case 3:
			cl = '.four';
			break;
		case 4:
			cl = '.five';
			break;
		case 5:
			cl = '.six';
			break;
	}
	this.replace (cl + " .down",null, digit);
	this.replace (cl + " .up",null, digit);
	this.replace (cl + " li.clock-active a div.up", digit);
	this.replace (cl + " li.clock-active .down", digit);
	this.replace(cl + " .clock-active");  
  }

// Replace the element to start the animation
  replace (cl, aattr, battr){
	this.el = this.shadowRoot.querySelector(cl);
	this.newel = this.el.cloneNode(true);
	//before
	if (battr) {
		if (cl.includes('.five') || cl.includes('.three')){if (battr === 20 ) {battr = 26; }} //workarround count 59
		this.newel.setAttribute("data-num", (parseInt(battr) - 1).toString()[1]);
	}
	//active
	if (aattr) {
		this.newel.setAttribute("data-num", (parseInt(aattr).toString()[1]));
	}
	this.el.parentNode.setAttribute("style", "display: '';");
	this.el.parentNode.replaceChild(this.newel, this.el);
	
	}
  
  
  getDateTime() {
    return new Date(Date.now() - Number(this.serverDiff) + 3600000 * Number(this.offset));
  }

  startInterval() {
    const now = this.getDateTime();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();
    const waitMs = this.format.includes('s') ? 1000 - ms * 1 : 60000 - s * 1000 - ms * 1;
    setTimeout(() => {
      this.update();
      this.startInterval();
    }, waitMs);
  }

}

window.customElements.define('ftui-flipclock', FtuiFlipClock);
