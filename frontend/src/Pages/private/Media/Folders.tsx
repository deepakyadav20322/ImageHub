import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

const Folders = () => {
    const { activeBucket } = useSelector((state: RootState) => state.resource);
  return (
    <div>
        This is folder page and current working bucket : " " {activeBucket}
    </div>
  )
}

export default Folders