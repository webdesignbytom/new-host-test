
import {
  findAllNotifications,
  createNewNotification,
  findNotificationsByUserId,
  updateNotificationById,
  findNotificationById,
  deleteNotificationById,
  findViewedNotifications,
} from '../domain/notifications.js';
// Response messages
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';


export const getAllNotifications = async (req, res) => {
  console.log('get all notifications');
  try {
    // Find all notifications
    const foundNotifications = await findAllNotifications();

    // If no found notifications
    if (!foundNotifications) {
      // Create error instance
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    foundNotifications.forEach((note, index) => {
      const createdDate = note.createdAt.toLocaleString();
      const updatedDate = note.updatedAt.toLocaleString();
      note.createdAt = createdDate;
      note.updatedAt = updatedDate;
    });

    return sendDataResponse(res, 200, { notifications: foundNotifications });
    //
  } catch (err) {
    //
    sendMessageResponse(res);
    throw err;
  }
};

export const getNotificationsByUserId = async (req, res) => {
  console.log('getNotificationsByUserId');
  const userId = req.params.userId;
  console.log('userId', userId);

  try {
    // Find all notifications
    const foundNotifications = await findNotificationsByUserId(userId);

    // If no found notifications
    if (!foundNotifications) {
      // Create error instance
      // Send response
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    foundNotifications.forEach((note, index) => {
      const date = note.createdAt.toLocaleString();
      note.createdAt = date;
    });

    return sendDataResponse(res, 200, { notifications: foundNotifications });
    //
  } catch (err) {
    //

    sendMessageResponse(res);
    throw err;
  }
};

export const getViewedNotificationsByUserId = async (req, res) => {
  const userId = req.params.userId;

  var bool = req.params.viewed;
  var value = JSON.parse(bool);

  try {
    const foundUser = await findUserById(userId);

    if (!foundUser) {
      return sendDataResponse(res, 404, {
        notification: 'User not found in database',
      });
    }

    const foundNotifications = await findViewedNotifications(userId, value);

    foundNotifications.forEach((note, index) => {
      const date = note.createdAt.toLocaleString();
      note.createdAt = date;
    });

    if (!foundNotifications) {
      return sendDataResponse(res, 404, {
        notification: 'User notifications not found in database',
      });
    }

    return sendDataResponse(res, 200, { notifications: foundNotifications });
  } catch (err) {
    //
    const serverError = new ServerErrorEvent(
      req.user,
      `Get viewed User notifications`
    );
    myEmitterErrors.emit('error', serverError);
    sendMessageResponse(res, serverError.code, serverError.message);
    throw err;
  }
};
export const createNotification = async (req, res) => {
  const { type, content, userId } = req.body;
  console.log(type, content, userId);

  try {
    if (!type || !content || !userId) {

      return sendMessageResponse(res, missingField.code, missingField.message);
    }

    const createdNotification = await createNewNotification(
      type,
      content,
      userId
    );


    return sendDataResponse(res, 201, { createdNotification });
  } catch (err) {
    //
    sendMessageResponse(res);
    throw err;
  }
};

export const setNotificationToViewed = async (req, res) => {
  console.log('setNotificationToView');
 const notificationId = Number(req.params.notificationId);
  console.log('notificationId', notificationId);

  try {
    const foundNotification = await findNotificationById(notificationId);
    console.log('foundNotification', foundNotification);
    // If no found notifications
    if (!foundNotification) {
      // Create error instance

      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    const updatedNotification = await updateNotificationById(notificationId);
    console.log('updated notification', updatedNotification);

    return sendDataResponse(res, 200, { notification: updatedNotification });
  } catch (err) {
    // Create error instance

    sendMessageResponse(res);
    throw err;
  }
};

export const deleteNotification = async (req, res) => {
  console.log('delete Notification');
  const notificationId = Number(req.params.notificationId);

  try {
    const foundNotification = await findNotificationById(notificationId);
    console.log('foundNotification', foundNotification);
    // If no found notifications
    if (!foundNotification) {
 
      return sendMessageResponse(res, notFound.code, notFound.message);
    }

    await deleteNotificationById(notificationId);
    return sendDataResponse(res, 200, {
      notification: foundNotification,
      message: `Notification ${foundNotification.name} deleted`,
    });
  } catch (err) {
    //

    sendMessageResponse(res);
    throw err;
  }
};
