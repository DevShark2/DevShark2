import React, { useState } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Comments from '../containers/Comments';

import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';

import * as actions from '../actions/actions'; 
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles({
  itemWrap: {
    background: '#fdfdfd',
    marginBottom: 15,
    minWidth: 350,
  },
  itemActions: {
    justifyContent: 'space-between',
    display: 'flex',
  },
  itemDiv: {
    marginTop: 8,
    marginBottom: 8,
  },
  // embed: {
  //   width: 300,
  //   height: 100,
  // }
});

// GET COMMENTS, this will make a GET request in actions folder, which will then populate the store with comment info
// that info will flow down into each comment component 
const mapDispatchToProps = dispatch => ({
  getComments: (resourceId) => dispatch(actions.getComments(resourceId))
});

const mapStateToProps = state => ({
  comments: state.comments
})

const FeedItem = (props) => {
  const {user, comments, likes, resources, feed, currentTopic, topics } = useSelector(state => state)
  const [liked, setLiked] = useState(props.liked)
  const [disLiked, setDisLiked] = useState(props.liked)
  const [total, setTotal] = useState(props.likes)

  // keep track of whether comments have been requested or not, initialized as FALSE
  const [commentsVisible, toggleCommentsVisible] = useState(false); 

  const classes = useStyles();
  // toggles the heart icon and calls action to increment/decrement 'likes' accordingly
  // props.liked, props.tech, and props.id passed down from DB to parent component to FeedItem
  const handleOnClickThumbUpIcon = () => {
    if(liked === null){
      setLiked(true)
      setTotal(JSON.parse(total)+1)
      props.likeFunc(user._id, props.id, 'addLike')
    } else if(liked === true){
      setLiked(null)
      setTotal(JSON.parse(total)-1)
      props.likeFunc(user._id, props.id, 'subtractLike')
    } else if(liked === false){  
      alert('please change your orginal vote first')
    }
  };

  const handleOnClickThumbDownIcon = () => {
    if(liked === null){
      setLiked(false)
      setTotal(JSON.parse(total)-1)
      props.likeFunc(user._id, props.id, 'subtractDislike')
    } else if (liked === false){
      setLiked(null)
      setTotal(JSON.parse(total)+1)
      props.likeFunc(user._id, props.id, 'addLike')
    } else if(liked === true){ 
      alert('please change your orginal vote first')
    }
  };

  const handleCommentsClick = () => {
    props.getComments(props.id); 
    toggleCommentsVisible(true); 
  }

  let displayLikes;
    switch(user) {
      case false :
        displayLikes = (
        <div>
          <Button onClick = {() => {alert(' To vote, please login.')}}>
          <ThumbUpOutlinedIcon color="disabled"/>
          </Button>
          {props.likes}
          <Button onClick = {() =>{alert(' To vote, please login.')}}>
          <ThumbDownOutlinedIcon color="disabled"/>
          </Button>
        </div>
        )
        break;
      default:
        displayLikes = (
      <div>
        <Button onClick={handleOnClickThumbUpIcon}>
        {liked === true ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        </Button>
        {total}
        <Button onClick={handleOnClickThumbDownIcon}>
            {liked === false ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
        </Button>
      </div>
      )
    }

  return (
    <Card className={classes.itemWrap}>
      <CardContent>
        <Box>
        {/* displays resource title */}
          <Typography variant="h6">{props.name}</Typography>
        </Box>
        {/* displays resource description */}
        <Typography variant="body1">{props.description}</Typography>

        {/* COMMENTS BUTTON, THIS WILL GET COMMENTS */}

        <Button onClick={handleCommentsClick}>{commentsVisible ? 'HIDE COMMENTS' : 'GET COMMENTS'}</Button>
        {/* visibility of comments dependent on whether user has made get request */}
        {commentsVisible 
          ? props.comments[props.id]
          ? <Comments fetching={false} comments={props.comments[props.id]} /> 
          : <Comments fetching={true} comments={null}/>
          :''
        } 

        <Divider className={classes.itemDiv} />
        <div className={classes.itemActions}>
        {/* displays resource link */}
          <Button size="small" color="primary">
            <a href={props.url} target="_blank">
              Visit Resource
            </a>
          </Button>
          {/* <embed
          src={props.url} 
          className={classes.embed}></embed> */}
          {displayLikes}
        </div>
      </CardContent>
    </Card>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);
