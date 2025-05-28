import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography } from './Typography';
import { Text } from './Text';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onClose,
}) => {
  const { theme } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return { backgroundColor: theme.error };
      case 'cancel':
        return { backgroundColor: theme.border };
      default:
        return { backgroundColor: theme.primary };
    }
  };

  const getButtonTextColor = (style?: string) => {
    switch (style) {
      case 'cancel':
        return theme.text;
      default:
        return '#ffffff';
    }
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    alertContainer: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      width: screenWidth - 40,
      maxWidth: 340,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    titleContainer: {
      marginBottom: message ? 12 : 20,
    },
    messageContainer: {
      marginBottom: 24,
    },
    buttonsContainer: {
      flexDirection: buttons.length > 2 ? 'column' : 'row',
      gap: 12,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flex: buttons.length <= 2 ? 1 : undefined,
      minHeight: 48,
    },
    singleButton: {
      flex: 1,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={dynamicStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={dynamicStyles.alertContainer}>
            <View style={dynamicStyles.titleContainer}>
              <Typography variant="h4" weight="semiBold" style={{ textAlign: 'center' }}>
                {title}
              </Typography>
            </View>
            
            {message && (
              <View style={dynamicStyles.messageContainer}>
                <Text
                  size={16}
                  color={theme.textSecondary}
                  style={{ textAlign: 'center', lineHeight: 22 }}
                >
                  {message}
                </Text>
              </View>
            )}

            <View style={dynamicStyles.buttonsContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    dynamicStyles.button,
                    getButtonStyle(button.style),
                    buttons.length === 1 && dynamicStyles.singleButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.8}
                >
                  <Text
                    weight="semiBold"
                    size={16}
                    color={getButtonTextColor(button.style)}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Hook to use custom alert
export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState<{
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
  }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const AlertComponent = () => (
    <CustomAlert
      visible={alertConfig.visible}
      title={alertConfig.title}
      message={alertConfig.message}
      buttons={alertConfig.buttons}
      onClose={hideAlert}
    />
  );

  return { showAlert, AlertComponent };
}; 