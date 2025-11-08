import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './UI/Card';
import Skeleton, { SkeletonCard } from './UI/Skeleton';
import EmptyState from './UI/EmptyState';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NoticeBox() {
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // Fetch the current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUser({ role: response.data.role });
      } catch (error) {
        console.log("Error fetching user details => ", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch notices only after the user role is available
  useEffect(() => {
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      let filteredNotices = [];
      if (currentUser?.role === 'management_admin') {
        filteredNotices = response.data.filter(notice => notice.sender_role === 'tpo_admin');
      } else if (currentUser?.role === 'tpo_admin') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'tpo_admin');
      } else if (currentUser?.role === 'student') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'student');
      }

      setNoticesData(filteredNotices);
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };

  const getViewAllLink = () => {
    if (currentUser?.role === 'student') return '/student/all-notice';
    if (currentUser?.role === 'tpo_admin') return '/tpo/all-notice';
    if (currentUser?.role === 'management_admin') return '/management/all-notice';
    return '#';
  };

  return (
    <Card
      className="my-2 mx-2 w-full"
      icon={<i className="fa-solid fa-bullhorn text-white"></i>}
      title="Notices"
      action={
        getViewAllLink() !== '#' && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={getViewAllLink()}
              className="no-underline font-semibold inline-flex items-center gap-1 group"
              style={{ color: 'var(--color-primary)' }}
            >
              View All
              <motion.i
                className="fa-solid fa-arrow-right text-xs"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </Link>
          </motion.div>
        )
      }
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex flex-col gap-3 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Skeleton variant="text" width="100%" height={60} count={3} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="relative h-72 overflow-y-auto rounded-xl p-2 custom-scrollbar"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {noticesData?.length > 0 ? (
              <div className="w-full flex flex-col gap-2">
                <AnimatePresence>
                  {noticesData.map((notice, index) => {
                    const isNew = (new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2;
                    const noticeLink =
                      currentUser?.role === 'student'
                        ? `/student/notice/${notice?._id}`
                        : currentUser?.role === 'tpo_admin'
                          ? `/tpo/notice/${notice?._id}`
                          : currentUser.role === 'management_admin'
                            ? `/management/notice/${notice?._id}`
                            : '';

                    return (
                      <motion.div
                        key={notice._id || index}
                        className="py-3 px-3 rounded-lg cursor-pointer border-l-4"
                        style={{
                          borderLeftColor: 'transparent',
                          backgroundColor: 'transparent',
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          x: 8,
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          borderLeftColor: 'var(--color-primary)',
                        }}
                      >
                        <Link
                          className="no-underline font-medium flex items-center gap-2"
                          style={{ color: 'var(--color-text)' }}
                          to={noticeLink}
                          target="_blank"
                        >
                          <motion.i
                            className="fa-solid fa-file-alt text-sm"
                            style={{ color: 'var(--color-primary)' }}
                            whileHover={{ scale: 1.2, rotate: 5 }}
                          />
                          <span>{notice?.title}</span>
                          {isNew && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <Badge
                                className="border-0"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: '#ffffff',
                                }}
                              >
                                New
                              </Badge>
                            </motion.span>
                          )}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <i
                            className="fa-solid fa-clock text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {new Date(notice?.createdAt).toLocaleDateString('en-IN')}{' '}
                            {new Date(notice?.createdAt).toLocaleTimeString('en-IN')}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState
                icon="fa-inbox"
                title="No notices found"
                description="You don't have any notices at the moment. Check back later for updates."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default NoticeBox;
