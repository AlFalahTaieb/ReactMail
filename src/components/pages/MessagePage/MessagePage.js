import React, {Component} from 'react'
import {connect} from 'react-redux'
import renderHtml from 'react-render-html'
import {Button, ButtonGroup, FormControl, FormGroup, ListGroup, ListGroupItem, Panel} from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import filesize from 'filesize'

import {PageWrapper} from '../PageWrapper'
import {downloadAttachment, getMessage} from '../../../actions/messageActionCreators'
import {reply} from '../../../actions/sendActionCreators'
import {getHeader} from '../../../messageMethods'

class MessagePage extends Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.onReplyChange = this.onReplyChange.bind(this);
    this.onSendReply = this.onSendReply.bind(this);
  }

  getInitialState() {
    return {
      reply: '',
      attachments: [],
      dropzoneActive: false
    };
  }

  componentWillMount() {
    this.props.getMessage(this.props.match.params.id);
  }

  onDrop(files) {
    this.setState({dropzoneActive: false});
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          attachments: [
            ...this.state.attachments,
            {
              name: files[i].name,
              size: files[i].size,
              type: files[i].type,
              blob: reader.result
            }
          ]
        })
      };
      reader.readAsBinaryString(files[i]);
    }
  }

  removeAttachment(file) {
    this.setState({
      attachments: this.state.attachments.filter(item => item !== file)
    })
  }

  onReplyChange(e) {
    this.setState({reply: e.target.value})
  }

  onSendReply(e) {
    e.preventDefault();
    const {message} = this.props;
    const {reply, attachments} = this.state;
    this.props.reply(message, reply, attachments);
    this.setState(this.getInitialState());
  }

  render() {
    let dropzoneRef;

    const dropzoneOverlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    };

    return (
      <div>
        {this.props.isLoaded && (
          <PageWrapper title='Voir le mail- Gmail'>
            <Panel header={
              <div>
                <span><i>De:</i> {getHeader(this.props.message, 'From')}</span>
                <hr style={{margin: '5px'}}/>
                <span><i>A:</i> {getHeader(this.props.message, 'To')}</span>
                <hr style={{margin: '5px'}}/>
                <span><i>Objet:</i> {getHeader(this.props.message, 'Subject')}</span>
              </div>
            }>
              {this.props.message.payload.htmlBody === '' ? (
                <i>Message vide</i>
              ) : (
                renderHtml(this.props.message.payload.htmlBody)
              )}
              {this.props.message.payload.attachments.length ? (
                  <div>
                    <hr/>
                    <ButtonGroup vertical>
                      {this.props.message.payload.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          onClick={() => this.props.downloadAttachment(this.props.message.id, attachment)}
                        >
                          <i className="fa fa-cloud-download" aria-hidden="true"/> {attachment.filename}
                          ({filesize(attachment.body.size)})
                        </Button>
                      ))}
                    </ButtonGroup>
                  </div>
                ) :
                (
                  null
                )}
            </Panel>
            <form onSubmit={this.onSendReply}>
              <FormGroup>
                <Dropzone
                  disableClick
                  style={{position: "relative"}}
                  onDrop={this.onDrop.bind(this)}
                  onDragEnter={() => this.setState({dropzoneActive: true})}
                  onDragLeave={() => this.setState({dropzoneActive: false})}
                  ref={(node) => {
                    dropzoneRef = node;
                  }}
                >
                  {this.state.dropzoneActive && <div style={dropzoneOverlayStyle}>
              Ajouter un fichier pour l'attacher à l'email
                  </div>}
                  <FormControl
                    placeholder='Répondre au mail'
                    name='message'
                    value={this.state.reply}
                    onChange={this.onReplyChange}
                    componentClass='textarea'
                    rows={3}
                    required
                  />
                </Dropzone>
              </FormGroup>

              <ListGroup>
                {this.state.attachments.map((file, index) => (
                  <ListGroupItem key={index} listItem={true}>
                    {file.name} ({filesize(file.size)})
                    <Button
                      onClick={() => this.removeAttachment(file)}
                      className='btn-link badge close'
                    >
                      &times;
                    </Button>
                  </ListGroupItem>
                ))}
              </ListGroup>


              <Button onClick={() => {
                dropzoneRef.open()
              }}>
               Ajouter un fichier
              </Button>

              <Button
                type='submit'
                className='pull-right'
                bsStyle='primary'
                style={{marginBottom: '100px'}}
              >
                Répondre
              </Button>
            </form>
          </PageWrapper>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    message: state.message.message,
    isLoaded: !!state.message.message
  }),
  dispatch => ({
    getMessage: (id) => {
      dispatch(getMessage(id))
    },
    downloadAttachment: (messageId, attachment) => {
      dispatch(downloadAttachment(messageId, attachment))
    },
    reply: (messageToReply, replyMessage, attachments) => {
      dispatch(reply(messageToReply, replyMessage, attachments));
    }
  })
)(MessagePage);