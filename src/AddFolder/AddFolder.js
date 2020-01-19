import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import PropTypes from 'prop-types';
import ValidationError from '../ValidationError/ValidationError'
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: {
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

  validateName(fieldValue) {
    const name = this.state.title.value.trim();
    if (name.length === 0) {
      return 'Title is required';
    } else if (name.length < 3) {
      return <div id="NFerrorMessage">New Folders must be 3 characters long</div>;
    }
  }

  updateName(title){
    this.setState({title: {value: title, touched: true}});
  }
  

goBack = () => {
    this.props.history.push('/');
}

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      title: e.target['foldername'].value,
  }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      body: JSON.stringify(folder),
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label 
            htmlFor='new-folder-name-input'>
              Folder Name
            </label>
            <input 
            type='text' 
            id='folder-name-input' 
            name='foldername' 
            autoComplete='off'
            placeholder='Folder Title'
            aria-label="Name of the new folder" 
            aria-required="true"
            aria-describedby="NFerrorMessage"
            onChange={e => this.updateName(e.target.value)}/>
             {this.state.title.touched && (<ValidationError message={this.validateName()}/>)} 
          </div>
          <div className='buttons'>
          <button 
                    type="button" 
                    className="button"  
                    aria-label="Button to Cancel creating new folder"
                    onClick={() => this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="button"
                    aria-label='submit button to create the new note'
                    aria-describedby='buttonError'
                    disabled={
                        this.validateName()}>
                     Submit
                 </button>
          </div>
          <div id='buttonError'>submit button will activate when form is filled out correctly.</div>
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propType = {
  title: PropTypes.string.isRequired
};
