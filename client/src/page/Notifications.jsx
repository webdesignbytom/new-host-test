import React, { useEffect, useState } from 'react';
import client from '../utils/client';

function Notifications() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [viewedNotifications, setViewedNotifications] = useState([]);
  const [unSeenNotifications, setUnSeenNotifications] = useState([]);

  const [createdSuccess, setCreatedSuccess] = useState({});
  const [deletedNote, setDeletedNote] = useState({});
  const [testForm, setTestForm] = useState({
    email: 'test@example.com',
    userId: 1,
    type: 'PURCHASE',
    content: 'testing',
  });

  useEffect(() => {
    client
      .get(`/notifications`)
      .then((res) => {
        setAllNotifications(res.data.data.notifications);
        const seenNotes = res.data.data.notifications.filter((notification) => notification.viewed === true);
        setViewedNotifications(seenNotes)
        const unseenNotes = res.data.data.notifications.filter((notification) => notification.viewed === false);
        setUnSeenNotifications(unseenNotes)
      })
      .catch((err) => {
        console.error('Unable to get notifications', err);
      });
  }, [deletedNote, createdSuccess]);

  const createNotification = (notification) => {
    client
      .post(`/notifications/create`, testForm, false)
      .then((res) => {
        setCreatedSuccess(res.data.data.createdNotification)
      })
      .catch((err) => {
        console.error('Unable to create notification', err);
      });
  };

  const markSeen = (note) => {
    client
      .put(`/notifications/viewed/${note.id}`, testForm)
      .then((res) => {
        const newNote = allNotifications.filter(
          (note) => note.id === res.data.data.notification.id
        );
        newNote[0].viewed = true;
        setAllNotifications([...allNotifications, newNote[0]]);

        const newUnseenArray = unSeenNotifications.filter(
          (note) => note.id !== res.data.data.notification.id
        );
        setUnSeenNotifications(newUnseenArray)
        setViewedNotifications([
            newNote[0],
            ...viewedNotifications
        ])
      })
      .catch((err) => {
        console.error('Unable to mark notification as seen', err);
      });
  };

  const deleteNotification = (note) => {
    client
      .delete(`/notifications/delete/${note.id}`)
      .then((res) => {
        setDeletedNote(res.data.data.notification);
      })
      .catch((err) => {
        console.error('Unable to delete notification', err);
      });
  };
  return (
    <>
      <div>
        <div>Notifications</div>
        <button onClick={createNotification}>NEW</button>
        <section className='grid grid-cols-3 text-center'>
          <div>
            <div>
              <h2>ALL NOTIFICATIONS</h2>
            </div>
            <section>
              {allNotifications.length > 0 ? (
                allNotifications.map((note, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className='grid grid-cols-3 border-2 border-solid border-black mb-2 mx-2'
                      >
                        <div>
                          <p>Note Id: {note.id}</p>
                          <p>Type: {note.type}</p>
                          <p className='text-red-500'>
                            Viewed: {JSON.stringify(note.viewed)}
                          </p>
                        </div>
                        <div>
                          <p>Content: {note.content}</p>
                          <p>UserId: {note.userId}</p>
                        </div>
                        <div>
                          <div
                            className='cursor-pointer border-2 border-solid border-black h-min p-2'
                            onClick={() => deleteNotification(note)}
                          >
                            Delete X
                          </div>
                          <div
                            className='cursor-pointer border-2 border-solid border-black h-min p-2'
                            onClick={() => markSeen(note)}
                          >
                            Mark Seen
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p>Nothing to display</p>
              )}
            </section>
          </div>
          <div>
            <div>
              <h2>UNSEED</h2>
            </div>
            <section>
              {unSeenNotifications.length > 0 ? (
                unSeenNotifications.map((note, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className='grid grid-cols-3 border-2 border-solid border-black mb-2 mx-2'
                      >
                        <div>
                          <p>Note Id: {note.id}</p>
                          <p>Type: {note.type}</p>
                          <p className='text-red-500'>
                            Viewed: {JSON.stringify(note.viewed)}
                          </p>
                        </div>
                        <div>
                          <p>Content: {note.content}</p>
                          <p>UserId: {note.userId}</p>
                        </div>
                        <div>
                          <div
                            className='cursor-pointer border-2 border-solid border-black h-min p-2'
                            onClick={() => deleteNotification(note)}
                          >
                            Delete X
                          </div>
                          <div
                            className='cursor-pointer border-2 border-solid border-black h-min p-2'
                            onClick={() => markSeen(note)}
                          >
                            Mark Seen
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p>Nothing to display</p>
              )}
            </section>
          </div>
          <div>
            <div>
              <h2>SEEN</h2>
            </div>
            <section>
              {viewedNotifications.length > 0 ? (
                viewedNotifications.map((note, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className='grid grid-cols-3 border-2 border-solid border-black mb-2 mx-2'
                      >
                        <div>
                          <p>Note Id: {note.id}</p>
                          <p>Type: {note.type}</p>
                          <p className='text-red-500'>
                            Viewed: {JSON.stringify(note.viewed)}
                          </p>
                        </div>
                        <div>
                          <p>Content: {note.content}</p>
                          <p>UserId: {note.userId}</p>
                        </div>
                        <div>
                          <div
                            className='cursor-pointer border-2 border-solid border-black h-min p-2'
                            onClick={() => deleteNotification(note)}
                          >
                            Delete X
                          </div>
                          <div
                            className='cursor-pointer border-2 border-solid border-black h-min p-2'
                            onClick={() => markSeen(note)}
                          >
                            Mark Seen
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p>Nothing to display</p>
              )}
            </section>
          </div>
        </section>
      </div>
    </>
  );
}

export default Notifications;
