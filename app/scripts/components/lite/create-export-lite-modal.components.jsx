import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Modal from '../shared/modal.components.jsx';
import {ExportLite} from './add-step-choice.components.jsx';

export default class CreateExportLiteModal extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		return (
			<Modal propName={this.props.propName}>
				<div className="modal-container-content">
					<h1>Export data</h1>
					<ExportLite />
				</div>
			</Modal>
		);
	}
}