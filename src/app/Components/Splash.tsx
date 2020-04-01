/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
import i18n = require('dojo/i18n!./../nls/resources');
import { subclass, declared, property } from 'esri/core/accessorSupport/decorators';
import Widget = require('esri/widgets/Widget');

import { ApplicationConfig } from 'ApplicationBase/interfaces';
import { renderable, tsx } from 'esri/widgets/support/widget';

const CSS = {
	modaltoggle: 'js-modal-toggle',
	trailer: 'trailer-half',
	overlay: 'modal-overlay',
	modal: 'js-modal',
	content: 'modal-content',
	button: 'btn',
	clearButton: 'btn-clear'
};
declare var calcite: any;

@subclass('app.Splash')
class Splash extends declared(Widget) {
	constructor(params) {
		super(params);
		this.config = params.config;
	}

	@property()
	@renderable()
	config: ApplicationConfig;

	@property()
	@renderable()
	modalId: string = 'splash';
	render() {
		const description = this.config.splashContent ? <span innerHTML={this.config.splashContent} /> : null;

		const splashContent = (
			<div id={this.modalId} class="js-modal modal-overlay" data-modal={this.modalId}>
				<div class="modal-content column-12 app-body" role="dialog" aria-labelledby="splash-title">
					<h3 id="splash-title" class="trailer-half">
						{this.config.splashTitle}
					</h3>
					<p>{description}</p>
					<div class="text-right">
						<button title={this.config.splashButtonText} class="btn btn-clear js-modal-toggle app-button">
							{this.config.splashButtonText}
						</button>
					</div>
				</div>
			</div>
		);

		return <div>{splashContent}</div>;
	}

	public createToolbarButton(): HTMLButtonElement {
		// add a button to the app that toggles the splash and setup to add to the view
		const splashButton = document.createElement('button');
		splashButton.setAttribute('data-modal', this.modalId);
		splashButton.setAttribute('title', i18n.widgets.splash.tooltip);
		const headerButtonClasses = [
			CSS.modaltoggle,
			CSS.button,
			'share-toggle',
			'esri-component',
			'esri-widget--button',
			'icon-ui-flush',
			'icon-ui-description'
		];

		splashButton.classList.add(...headerButtonClasses);
		/*åsplashButton.addEventListener("click", () => {
      calcite.bus.on("modal:open", () => {
        console.log("Opened focus should be trapped")
      });
    });*/
		calcite.bus.on('modal:close', () => {
			splashButton.focus();
		});
		calcite.bus.on('modal:open', () => {
			// need to fix focus issue
		});
		return splashButton;
	}

	public showSplash() {
		calcite.init();
		if (this.config.splashOnStart) {
			// enable splash screen when app loads then
			// set info in session storage when its closed
			// so we don't open again this session.
			if (!sessionStorage.getItem('disableSplash')) {
				calcite.bus.emit('modal:open', { id: this.modalId });
			}
			sessionStorage.setItem('disableSplash', 'true');
		}
	}
}

export default Splash;
