import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '@/helpers/AuthContext';
import Image from 'next/image';

interface ProfileProps {
  profilePicture: string;
}

const ProfilePicture: React.FC<ProfileProps> = ({ profilePicture }) => {
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const { updateUser } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDroppedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const uploadFile = async () => {
      if (droppedFile) {
        try {
          const formData = new FormData();
          formData.append('profilePic', droppedFile);

          const response = await axios.put(`${process.env.BACKEND}${user?.role}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              token: Cookies.get('token'),
            },
          });

          // Update user profile picture or take any other necessary action
          // updateUser(response.data.updatedUser);
        } catch (error) {
          console.error('Error uploading file', error);
        }
      }
    };

    uploadFile();
  }, [droppedFile, user?.role]);

  return (
    <div className="space-y-8">
      <div className="relative">
        {user?.profilePic ? (
          <img             
            src={droppedFile ? URL.createObjectURL(droppedFile) : profilePicture}
            alt="" width={200} height={300} className="w-48 rounded-xl" />
        ) : (
          <Image src={user?.gender === 'male' || user?.gender === null ? '/male.png' : '/female.png'} width={200} height={300} alt="male" className="w-48 rounded-xl" />
        )}

        <IconButton {...getRootProps()} color="secondary" component="span" className="hover:text-primary absolute bottom-0 left-0">
          <PhotoCameraIcon />
        </IconButton>
        <input {...getInputProps()} />
      </div>
      {/* ... (other profile details) */}
    </div>
  );
};

export default ProfilePicture;
