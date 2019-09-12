import React, {Component} from 'react'

import 'draft-js/dist/Draft.css'
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js'
import axios from 'axios'

import './FileZone.css'
import './ControlPanel.css'

class FileZone extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      selectedValue: '',
      isShow: false,
      synonyms: []
    }

  }

  componentDidMount () {
    this.focus()
  }

  onChange = (editorState) => {
    this.setState({
      editorState: editorState,
      isShow: false
    })
  }

  renderOptions = () => {
    this.getSynonym()
    return this.state.synonyms.map(synonym => <option key={synonym.score+synonym.word}>{synonym.word}</option>)
  }

  getSynonym = async () => {
    const res = await axios.get(`https://api.datamuse.com/words?ml=${this.state.selectedValue}`)
    this.setState({synonyms: res.data})
  }

  getValueSelected = () => {
    const {editorState} = this.state
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const anchorKey = selection.getAnchorKey()
    const currentBlock = contentState.getBlockForKey(anchorKey)
    const start = selection.getStartOffset()
    const end = selection.getEndOffset()
    const selectedText = currentBlock.getText().slice(start, end)
    this.setState({selectedValue: selectedText, isShow: true})
  }

  replaceWord = (e) => {
    const {editorState} = this.state
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const txt = e.target.value
    let nextEditorState = EditorState.createEmpty()
    const nextContentState = Modifier.replaceText(contentState, selection, txt)
    nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'insert-characters'
    )
    this.onChange(nextEditorState)
  }

  focus = () => {
    this.editor.focus()
  }

  updateOnBold = (value) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, value))
  }

  render () {
    return (
      <div id="file-zone">
        <div id="control-panel">
          <div id="format-actions">
            <button className="format-action" type="button" onClick={() => this.updateOnBold('BOLD')}><b>B</b></button>
            <button className="format-action" type="button" onClick={() => this.updateOnBold('ITALIC')}><i>I</i>
            </button>
            <button className="format-action" type="button" onClick={() => this.updateOnBold('UNDERLINE')}><u>U</u>
            </button>
            {!this.state.isShow && <button className="format-action" type="button" onClick={this.getValueSelected}><u>Synonyms</u></button>}
            {this.state.isShow && <select className='select-synonym' onChange={this.replaceWord}>{this.renderOptions()}</select>}
          </div>
        </div>
        <div id="file" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref={(e) => {
              this.editor = e
            }}
            placeholder="Start writing"
            spellCheck
          />
        </div>
      </div>
    )
  }
}

export default FileZone
