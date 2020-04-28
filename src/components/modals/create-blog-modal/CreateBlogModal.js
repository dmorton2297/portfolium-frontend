import React, { useState } from 'react'
import { withStyles } from '@material-ui/styles'
import styles from './styles';
import { object, bool, func, string } from 'prop-types';
import BaseModal from '../base-modal';
import { Typography, TextField, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Cancel';
import { createBlogPost } from '../../../services/webService';
import { validateBlogPost, isInvalid } from '../../../utils/validator';
import { resetState } from '../../../utils/resetState';
import { useDispatch } from 'react-redux';
import { addBlogPost } from '../../../actions/blogActions';
const CreateBlogModal = ({ classes, open, onClose, ariaLabelledBy, ariaDescribedby, currUser, showSuccess }) => {

    const STEPS = {
        general: 'General',
        content: 'Content'
    }
    const [step, setStep] = useState(STEPS.general);
    const [invalid, setInvalid] = useState([]);
    const [state, setState] = useState({
        title: '',
        description: '',
        image: '',
        tags: '',
        text: ''
    });

    const dispatch = useDispatch();

    const onSubmit = () => {
        console.log('in here');
        console.log(state);
        const _validate = validateBlogPost(state);
        console.log(_validate);
        if (!_validate.isValid) {
            setInvalid(_validate.results);
        }
        else {
            setInvalid([])
            console.log('in create');
            createBlogPost({ ...state, tags: state.tags.split(',') }, currUser.id).then((res) => {
                resetState(state, setState, setInvalid);
                dispatch(addBlogPost(res.data));
                onClose();

            });

        }
    }

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedby}
            buttonText="create"
            buttonFunc={onSubmit}
            cancelButton={true}
            stepButton={{
                text: step === STEPS.content ? 'Previous' : 'Next',
                action: step === STEPS.content ? () => setStep(STEPS.general) : () => setStep(STEPS.content)
            }}
            showButton={step === STEPS.content}>
            <Typography variant="h2">Create Post</Typography>
            {step === STEPS.general &&
                <div className={classes.generalInfoForm}>
                    <Typography className='margin-bottom' variant="h1">Let's get some general info ...</Typography>
                    <div className='form-section'>
                        <TextField error={isInvalid('title', invalid)} variant="outlined" label="Blog Title" defaultValue={state.title} placeholder="Name"
                            helperText={isInvalid('title', invalid) ? 'Required. Must be less than 60 characters.' : ''} onChange={(event) => {
                                setState({ ...state, title: event.target.value })
                            }} />
                        <TextField error={isInvalid('description', invalid)} variant="outlined" label="Blog Description" multiline rows={3} defaultValue={state.description} placeholder="Description"
                            helperText={isInvalid('description', invalid) ? 'Required.' : ''} onChange={(event) => {
                                setState({ ...state, description: event.target.value })

                            }} />
                        <TextField error={isInvalid('tags', invalid)} variant="outlined" label="Blog Tags" defaultValue={state.tags} placeholder="tag,tag,tag"
                            helperText={isInvalid('tags', invalid) ? 'Must be a comma seperated list' : ''} onChange={(event) => {
                                setState({ ...state, tags: event.target.value })
                            }} />
                    </div>
                    <div className='form-section'>
                        <Typography variant='h1' className='bottom-margin'>Add Post Image (Required)</Typography>
                        <Typography variant='h2' className='bottom-margin'>.PNG, .JPEG, .GIF allowed</Typography>
                        {state.image !== '' &&
                            <div className={classes.imageRow}>
                                <Typography varant="body2" className={classes.imageRowContent}>{state.image}</Typography>
                                <IconButton styles={{ color: 'white' }} onClick={() => setState({
                                    ...state, image: ''
                                })}><CloseIcon /></IconButton>
                            </div>
                        }
                        <Button
                            className={classes.addImageButton}
                            variant="contained"
                            component="label">
                            Add Image
                            <input type="file" style={{ display: 'none' }} onChange={event => {
                                setState({ ...state, image: event.target.value });
                            }} />
                        </Button>
                    </div>
                </div>

            }
            {step === STEPS.content &&
                <TextField error={isInvalid('text', invalid)} variant="outlined" label="Text" defaultValue='' placeholder="Markdown"
                    helperText={isInvalid('text', invalid) ? 'Required' : ''} onChange={(event) => {
                        setState({ ...state, text: event.target.value })
                    }} multiline rows={55} />
            }

        </BaseModal>
    )
}

CreateBlogModal.propTypes = {
    classes: object.isRequired,
    open: bool.isRequired,
    onClose: func.isRequired,
    ariaLabelledBy: string,
    currUser: object.isRequired,
    ariaDescribedby: string,
    showSuccess: func.isRequired
}

export default withStyles(styles)(CreateBlogModal)
