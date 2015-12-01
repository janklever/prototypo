import React from 'react';
import Lifespan from 'lifespan';

import LocalClient from '../stores/local-client.stores.jsx';

import DeleteParamGroup from './delete-param-group.components.jsx';
import EditParamGroupPanel from './edit-param-group-panel.components.jsx';
import GlyphGrid from './glyph-grid.components.jsx';

export default class EditParamGroup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: [],
		};
	}

	componentWillMount() {
		this.client = LocalClient.instance();
		this.lifespan = new Lifespan();

		this.client.getStore('/individualizeStore', this.lifespan)
			.onUpdate(({head}) => {
				this.setState({
					currentGroup: head.toJS().currentGroup,
					groups: head.toJS().groups,
					preDelete: head.toJS().preDelete,
					editGroup: head.toJS().editGroup,
					glyphs: head.toJS().selected,
					grid: head.toJS().glyphGrid,
					tagSelected: head.toJS().tagSelected,
					otherGroups: head.toJS().otherGroups,
					errorEdit: head.toJS().errorEdit,
				});
			})
			.onDelete(() => {
				this.setState(undefined)
			});

		this.client.getStore('/tagStore', this.lifespan)
			.onUpdate(({head}) => {
				this.setState({
					tags: head.toJS().tags,
				});
			})
			.onDelete(() => {
				this.setState(undefined);
			});
	}

	componentWillUnmount() {
		this.lifespan.release();
	}

	selectGroup(e) {
		this.client.dispatchAction('/select-indiv-group', e.target.value);
	}

	render() {
		const options = _.map(this.state.groups, (group) => {
				return <option value={group} key={group}>{group}</option>
		});

		const deletePanel = this.state.preDelete ?
			<DeleteParamGroup glyphs={this.state.glyphs} groupName={this.state.currentGroup}/> :
			false;

		const editPanel = this.state.editGroup ?
			<EditParamGroupPanel errorEdit={this.state.errorEdit} glyphsInOther={this.state.otherGroups} glyphs={this.state.glyphs} groupName={this.state.currentGroup}/> :
			false;

		const glyphGrid = this.state.grid ? (
			<GlyphGrid 
				otherGroups={this.state.otherGroups}
				tagSelected={this.state.tagSelected}
				selected={this.state.glyphs}
				tags={this.state.tags}/>
		) : false;

		return (
			<div className="edit-param-group">
				Editing
				<select onChange={(e) => { this.selectGroup(e) }} value={this.state.currentGroup} className="edit-param-group-select">
					{options}
				</select>
				<span className="edit-param-group-button alert" onClick={() => {this.client.dispatchAction('/pre-delete', true)}}>DELETE</span>
				<span className="edit-param-group-button" onClick={() => {this.client.dispatchAction('/edit-param-group', true)}}>EDIT</span>
				<span className="edit-param-group-button" onClick={() => {this.client.dispatchAction('/create-mode-param-group')}}>CREATE NEW GROUP</span>
				{deletePanel}
				{editPanel}
				{glyphGrid}
			</div>
		)
	}
}
