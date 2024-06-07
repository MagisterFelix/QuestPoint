import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Card, Modal, Portal, Text } from 'react-native-paper';

import { windowSize } from '@/common/constants';
import { styles } from '@/common/styles';
import { MessageProps } from '@/types/Quests/props';

const Message = ({ message, isOwner }: MessageProps) => {
  const [showImage, setShowImage] = useState<boolean>(false);
  const toggleImage = () => setShowImage(!showImage);

  return (
    <View>
      <Card
        style={isOwner ? styles.messageCurrentUser : styles.messageOtherUser}
      >
        {message.content_type === 'Text' ? (
          <Card.Content>
            <Text>{message.content}</Text>
          </Card.Content>
        ) : (
          <Card.Content>
            <TouchableOpacity onPress={toggleImage}>
              <Image
                source={{ uri: message.content }}
                resizeMode="contain"
                style={styles.messageImage}
              />
            </TouchableOpacity>
          </Card.Content>
        )}
      </Card>
      <Portal>
        <Modal
          visible={showImage}
          onDismiss={toggleImage}
          contentContainerStyle={[
            styles.modal,
            { height: windowSize.height * 0.4 }
          ]}
          style={styles.modalImage}
        >
          <Image
            source={{ uri: message.content }}
            resizeMode="contain"
            style={styles.messagePreview}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default Message;
