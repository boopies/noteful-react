import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import {uniqueID} from '../notes-helpers'
import './AddNote.css'
import ValidationError from '../ValidationError/ValidationError'
import PropTypes from 'prop-types';

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: {
          value: '',
          touched:false
        },
        content: {
          value: '',
          touched:false
        },
        folder: {
          value: '',
          touched:false
        }
  }
}

  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  goBack = () => {
    this.props.history.goBack();
}

validateName(fieldValue) {
  const name = this.state.name.value.trim();
  if (name.length === 0) {
    return 'Name is required';
  } else if (name.length < 2) {
    return 'Note name must be at least 2 characters long';
  }
}

validateContent(fieldValue) {
  const content = this.state.content.value.trim();
  if (content.length === 0) {
    return 'There must be some content';
}
}

validateFolderId(fieldValue) {
  const folderID = this.state.folder.value.trim();
  if (folderID.length === 0) {
    return 'A folder must be selected';
  }
}

updateName(noteName){
  this.setState({name: {value: noteName, touched: true}});
}

updateContent(content){
  this.setState({content: {value: content, touched: true}});
}

updateFolderId(folderID){
  this.setState({folder: {value: folderID, touched: true}});
}


  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
        id: uniqueID(),
        name: e.target['noteName'].value,
        modified: new Date(),
        folderId: e.target['folderID'].value,
        content: e.target['content'].value,
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folderId}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input 
            type='text' 
            id='note-name-input' 
            name='noteName'
            placeholder="Note Name"
            onChange={e => this.updateName(e.target.value)}/>
            {this.state.name.touched && (<ValidationError message={this.validateName()}/>)}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea
                type='text'
                cols="50"
                rows="10"
                id='note-content-input' 
                name='content'
                placeholder='Contents of Note' 
                autoComplete='off'
                onChange={e => this.updateContent(e.target.value)}/>
                {this.state.content.touched && (<ValidationError message={this.validateContent()}/>)}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select 
                id='note-folder-select' 
                name='folderID'
                autoComplete='off'
                onChange={e => this.updateFolderId(e.target.value)} >
              <option value=''>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            {this.state.folder.touched && (<ValidationError message={this.validateFolderId()}/>)}
          </div>
          <div className='buttons'>
          <button 
              type="button" 
              className="button"
              onClick={() => this.goBack()}>
              Cancel
            </button>

            <button 
            type='submit'
              className="button"
              disabled={this.validateName()||
                this.validateContent()||
                this.validateFolderId()}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddNote.defaultProps = {
  name: '',
  content:'',
  folder:''
};

AddNote.propTypes ={
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired
}
