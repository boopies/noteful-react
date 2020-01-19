import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
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
    return <div id="NNErrorMessage">New Notes's name must be 3 characters long.</div>;
  }
}

validateContent(fieldValue) {
  const content = this.state.content.value.trim();
  if (content.length === 0) {
    return <div id="NCErrorMessage">You must add some contents to the new note.</div>;
} else if (content.length < 5){
  return <div id="NCErrorMessage">The content must contain 5 or more characters.</div>;
}
}

validateFolderId(fieldValue) {
  const folderID = this.state.folder.value.trim();
  if (folderID.length === 0) {
    return <div id="FSErrorMessage">You must select a folder to add the new note to.</div>;
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
        title: e.target['noteName'].value,
        date: new Date(),
        folder_id: e.target['folderID'].value,
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
        this.props.history.push(`/`)
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
            <label 
            htmlFor='newNoteInput'>
              Name
            </label>
            <input
            type='text' 
            id='new-note-name-input' 
            name='noteName'
            placeholder="Note Name"
            aria-label="Name of the new note" 
            aria-required="true"
            aria-describedby="NNErrorMessage"
            onChange={e => this.updateName(e.target.value)}/>
            {this.state.name.touched && (<ValidationError message={this.validateName()}/>)}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
             Content
            </label>
            <textarea
                type='text'
                cols='50'
                rows='10'
                id='new-note-contents' 
                name='content'
                placeholder='Contents of Note' 
                autoComplete='off'
                aria-label='Contents of the note.' 
                aria-required='true'
                aria-describedby='NCErrorMessage'
                onChange={e => this.updateContent(e.target.value)}/>
                {this.state.content.touched && (<ValidationError message={this.validateContent()}/>)}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select 
                id='new-note-folder' 
                name='folderID'
                autoComplete='off'
                aria-label='Folder selection to add note' 
                aria-required='true'
                aria-describedby='FSErrorMessage'
                onChange={e => this.updateFolderId(e.target.value)} >
              <option value=''>...</option>
              {folders.map(folder =>
                <option 
                key={folder.id} 
                value={folder.id}
                aria-label='Folder names for selection' >
                  {folder.title}
                </option>
              )}
            </select>
            {this.state.folder.touched && (<ValidationError message={this.validateFolderId()}/>)}
          </div>
          <div className='buttons'>
          <button 
              type='button' 
              className='button'
              aria-label='Button to Cancel creating new note'
              onClick={() => this.goBack()}>
              Cancel
            </button>

            <button 
            type='submit'
              className='button'
              aria-label='submit button to create the new note'
              aria-describedby='buttonError'
              disabled={this.validateName()||
                this.validateContent()||
                this.validateFolderId()}>
              Submit
            </button>
          </div>
          <div id='buttonError'>submit button will activate when form is filled out correctuly.</div>
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
