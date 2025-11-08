import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../UI/Card';
import Skeleton from '../UI/Skeleton';
import EmptyState from '../UI/EmptyState';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NotificationBox() {
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

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

  useEffect(() => {
    fetchJobs();
  }, [currentUser?.role]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log(response.data.data)
      // retriving lastest post
      if (response.data && response.data.data) {
        setJobs(response.data.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 10));
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.log('Error while fetching notices => ', error);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card
      className="my-2 mx-2 w-full"
      icon={<i className="fa-solid fa-bell text-white"></i>}
      title="Notifications"
      action={
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-error)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
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
            {jobs?.length > 0 ? (
              <div className="w-full flex flex-col gap-2">
                <AnimatePresence>
                  {jobs.map((job, index) => {
                    const isNew = (new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2;

                    return (
                      <motion.div
                        key={job._id || index}
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
                          to={`/student/job/${job?._id}`}
                          target="_blank"
                        >
                          <motion.i
                            className="fa-solid fa-briefcase text-sm"
                            style={{ color: 'var(--color-primary)' }}
                            whileHover={{ scale: 1.2, rotate: -5 }}
                          />
                          <span>{job?.jobTitle}</span>
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
                            {new Date(job?.postedAt).toLocaleDateString('en-IN')}{' '}
                            {new Date(job?.postedAt).toLocaleTimeString('en-IN')}
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
                title="No notifications found"
                description="You don't have any job notifications at the moment. New job postings will appear here."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default NotificationBox
