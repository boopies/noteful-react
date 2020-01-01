import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import PropTypes from 'prop-types';
import ValidationError from '../ValidationError/ValidationError'
import { uniqueID } from '../notes-helpers'
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: {
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
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Folder name must be at least 3 characters long';
    }
  }

  updateName(title){
    this.setState({name: {value: title, touched: true}});
  }
  

goBack = () => {
    this.props.history.push('/');
}

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      id: uniqueID(),
      name: e.target['foldername'].value,
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
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input 
            type='text' 
            id='folder-name-input' 
            name='foldername' 
            autoComplete='off'
            placeholder='Folder Title'
            onChange={e => this.updateName(e.target.value)}/>
             {this.state.name.touched && (<ValidationError message={this.validateName()}/>)} 
          </div>
          <div className='buttons'>
          <button 
                    type="button" 
                    className="button"
                    onClick={() => this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="button"
                    disabled={
                        this.validateName()}>
                     Create Folder
                 </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propType = {
  name: PropTypes.string.isRequired
};
