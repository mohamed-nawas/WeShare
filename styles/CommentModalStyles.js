import styled from 'styled-components';
import {windowWidth, windowHeight} from '../utils/Dimensions';

export const Container = styled.View`
  background-color: #d9dddf;
  align-items: center;
  padding-left: ${windowWidth * 0.02}px;
  padding-right: ${windowWidth * 0.02}px;
  padding-top: 15px;
  height: ${windowHeight * 0.86}px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

export const CommentContainer = styled.View`
  width: ${windowWidth}px;
  height: ${windowHeight * 0.1}px;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Comment = styled.TextInput`
  height: 60%;
  width: 80%;
  margin-left: 15px;
  background-color: #d9dddf;
  border-radius: 10px;
`;

export const Send = styled.TouchableOpacity`
  width: 10%;
  height: 60%;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;
