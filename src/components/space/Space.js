import React, { useEffect, useState, useRef } from 'react'
import { withStyles } from '@material-ui/styles'
import styles from './styles';
import classNames from 'classnames';
import DefaultButton from '../shared/default-button';
import { Typography, Card, Grid, IconButton, Snackbar, SnackbarContent, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProjects, updateProfile } from '../../services/webService';
import { setProjects } from '../../actions/projectsActions';
import ProjectCard from '../project-card';
import ProjectModal from '../modals/project-modal';
import AddIcon from '@material-ui/icons/Add';
import { object, bool } from 'prop-types';
import AddProjectModal from '../modals/add-project-modal';
import theme from '../../theme';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { updateUser } from '../../actions/userActions';
import Tag from '../shared/tag';

const Space = ({ classes, user, readOnly }) => {
    const dispatch = useDispatch();
    const projects = useSelector(state => state.projectsReducer);
    const projectsSection = useRef();
    const overviewCard = useRef();

    const [selectedProject, setSelectedProject] = useState(null);
    const [addProject, setAddProject] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [success, showSuccess] = useState(null);
    const [tagBuffer, setTagBuffer] = useState(null);
    const [newTag, setNewTag] = useState(null);

    useEffect(() => {
        getUserProjects(user.id).then((res) => {
            dispatch(setProjects(res.data));
        }).catch(error => {
            console.error(error);
        })

        const onScroll = () => {
            const position = projectsSection.current.getBoundingClientRect();
            const cardRect = overviewCard.current.getBoundingClientRect();
            if (position.y <= cardRect.bottom) {
                const percentage = (cardRect.bottom - position.y) / cardRect.bottom;
                overviewCard.current.style.backgroundColor = `rgba(0, 0, 0, ${percentage}`;
                overviewCard.current.style.boxShadow = 'none';
            } else {
                overviewCard.current.style.backgroundColor = theme.palette.primary.light;
                overviewCard.current.style.boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';

            }
        }
        const scrollContainer = document.getElementById('scroll-container');
        scrollContainer.addEventListener('scroll', onScroll);
        return () => {
            scrollContainer.removeEventListener('scroll', onScroll)
        }
    }, [dispatch, user]);

    const openProjectModal = (project) => {
        setSelectedProject(project);
    }

    const closeProjectModal = () => {
        setSelectedProject(null);
    }

    const showSuccessMessage = (message) => {
        showSuccess(message);
    }

    const editProfileClicked = () => {
        if (!!editProfile) {
            setEditProfile(null);
            setTagBuffer(null);
        }
        else {
            setEditProfile({ ...user });
            setTagBuffer(user.tags);
        }
    }

    const onGithubClicked = () => {
        window.open(user.github);
    }

    const onLinkedInClicked = () => {
        window.open(user.linkedin);
    }

    const onUpdateProfile = () => {
        if (!editProfile) {
            return;
        }
        updateProfile({ ...editProfile, tags: tagBuffer }, user.id).then((res) => {
            showSuccessMessage('Profile Updated');
            dispatch(updateUser(res.data));
            setEditProfile(null);
            setTagBuffer(null);
        })
    }

    const onDeleteTag = tag => {
        setTagBuffer(tagBuffer.filter(x => x !== tag));
    }

    const onAddTag = () => {
        setTagBuffer([...tagBuffer, newTag]);
    }

    return (
        <div className={classNames(classes.container, 'profile-container')}>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => showSuccess(null)} >
                <SnackbarContent className='snackbar-width' message={success} action={<IconButton style={{ color: 'white' }} onClick={() => showSuccess(null)}><CloseIcon /></IconButton>} />
            </Snackbar>
            <ProjectModal open={!!selectedProject} project={selectedProject} onClose={closeProjectModal} ariaLabelledBy='View Project' ariaDsescribedBy='View Project' />
            <AddProjectModal showSuccess={showSuccessMessage} open={addProject} currUser={user} onClose={() => setAddProject(false)} ariaLabelledBy='Add Project' ariaDsescribedBy='Add Project' />

            <div className={classes.topPortion}>
                <Card ref={overviewCard}>
                    <div className={classNames(classes.topPortion, 'bottom-margin')}>
                        <Typography variant="h1" className={classNames(!readOnly ? classes.headerText : {}, 'margin-bottom')}>{user.name}'s Space</Typography>
                        <div className={classes.tags}>
                            {!readOnly &&
                                <div className='grow'>
                                    <div className={classes.editButton} onClick={editProfileClicked}>
                                        <EditIcon style={{ height: 12, width: 12, marginRight: 5 }} />
                                        <Typography variant="body2">Edit Profile Details</Typography>
                                    </div>
                                </div>
                            }
                            {!tagBuffer && user.tags.map(x => (
                                <Tag key={x.length + (Math.random() * 100)} content={x} />
                            ))}
                            {tagBuffer && tagBuffer.length < 6 &&
                                <React.Fragment>
                                    <TextField style={{ width: 100 }} label="" defaultValue='' placeholder='new tag'
                                        onChange={(event) => {
                                            setNewTag(event.target.value);
                                        }} />
                                    <IconButton onClick={onAddTag}><AddIcon style={{ width: 30, height: 30 }} /></IconButton>
                                </React.Fragment>
                            }
                            {tagBuffer && tagBuffer.map(x => (
                                <Tag content={x} readOnly={!editProfile} key={x.length + (Math.random() * 100)} onDelete={tag => onDeleteTag(tag)} />

                            ))}
                        </div>
                    </div>
                    <div className={classNames(classes.infoContainer)}>
                        <div className={classNames(classes.imageContainer)}>
                            <img src={user.profileImage} width="320px" height="320px" alt="test" />
                        </div>
                        <div className={classNames(classes.generalInfoContainer)}>
                            {editProfile &&
                                <div className='full-width'>
                                    <div className={classes.inputs}>
                                        <TextField variant="outlined" label="Job Title" defaultValue={user.title} placeholder="title"
                                            onChange={(event) => {
                                                setEditProfile({ ...editProfile, title: event.target.value });
                                            }} />
                                        <TextField variant="outlined" label="Company Title" defaultValue={user.company} placeholder="title"
                                            onChange={(event) => {
                                                setEditProfile({ ...editProfile, company: event.target.value });
                                            }} />
                                        <TextField variant="outlined" label="User Email" defaultValue={user.email} placeholder="title"
                                            onChange={(event) => {
                                                setEditProfile({ ...editProfile, email: event.target.value });
                                            }} />
                                        <TextField variant="outlined" label="Summary" defaultValue={user.summary} placeholder="title"
                                            onChange={(event) => {
                                                setEditProfile({ ...editProfile, summary: event.target.value });
                                            }} />
                                        <TextField variant="outlined" label="Github" defaultValue={user.github} placeholder="url"
                                            onChange={(event) => {
                                                setEditProfile({ ...editProfile, github: event.target.value });
                                            }} />
                                        <TextField variant="outlined" label="LinkedIn" defaultValue={user.linkedin} placeholder="url"
                                            onChange={(event) => {
                                                setEditProfile({ ...editProfile, linkedin: event.target.value });
                                            }} />
                                    </div>
                                    <div className='flex'>
                                        <DefaultButton onClick={onUpdateProfile}>Update</DefaultButton>
                                        <DefaultButton warn={true} onClick={() => {
                                            setEditProfile(null);
                                            setTagBuffer(null);
                                        }}>Cancel</DefaultButton>
                                    </div>
                                </div>

                            }
                            {!editProfile &&
                                <div>
                                    <Typography variant="h2" className={classNames(classes.infoItem)}>{user.title}</Typography>
                                    <Typography variant="h3" className={classNames(classes.infoItem, classes.company)}>{user.company}</Typography>
                                    <Typography variant="h3" className={classNames(classes.infoItem)}>Contact: {user.email}</Typography>
                                    <Typography variant="h2" className={classNames(classes.infoItem, classes.summary)}>"{user.summary}"</Typography>
                                    <div className={classes.socialButtons}>
                                        <DefaultButton onClick={onGithubClicked}>Github</DefaultButton>
                                        <DefaultButton onClick={onLinkedInClicked}>LinkedIn</DefaultButton>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </Card>
            </div>

            <div className={classes.projects}>
                <div className={classes.projectsHeader} ref={projectsSection}>
                    <Typography variant="h1">Projects</Typography>
                    {!readOnly &&
                        <IconButton onClick={() => setAddProject(true)}>
                            <AddIcon />
                        </IconButton>
                    }
                </div>
                <Grid className={classes.projectCards} container spacing={3}>
                    {projects.map(project => (
                        <Grid item xs={4} key={project.id}>
                            <ProjectCard showSuccess={showSuccessMessage} currUser={user} project={project} onClick={() => openProjectModal(project)} />
                        </Grid>
                    ))}
                    {projects.length === 0 &&
                        <Grid item xs={12}>
                            <Typography variant="h2" className={classes.noProjectsMessage}>No projects have been created.</Typography>
                        </Grid>
                    }
                </Grid>
            </div>
        </div>
    );
};

Space.propTypes = {
    classes: object.isRequired,
    user: object.isRequired,
    readOnly: bool
};

Space.defaultProps = {
    readOnly: false
};

export default withStyles(styles)(Space);