import { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Card, Modal, Portal, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { MessageProps } from '@/types/props';

const Message = ({ message, isOwner }: MessageProps) => {
  const [showImage, setShowImage] = useState<boolean>(false);
  const toggleImage = () => setShowImage(!showImage);

  return (
    <>
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
                style={{ width: 150, height: 150 }}
              />
            </TouchableOpacity>
          </Card.Content>
        )}
      </Card>
      <Portal>
        <Modal
          visible={showImage}
          onDismiss={toggleImage}
          contentContainerStyle={styles.modal}
          style={styles.modalImage}
        >
          <Image
            source={{ uri: message.content }}
            resizeMode="contain"
            style={{ width: 300, height: 300 }}
          />
        </Modal>
      </Portal>
    </>
  );
};

export default Message;
