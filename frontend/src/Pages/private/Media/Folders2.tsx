import { useGetFoldersQuery } from '@/redux/apiSlice/itemsApi';
import { setFoldersDataWithParent } from '@/redux/features/itemsSlice';
import { RootState } from '@/redux/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Folders2 = () => {
    const { activeBucket } = useSelector((state: RootState) => state.resource);
    // const { folderId } = useParams(); // Get folderId from URL
    const folderId = '2e79bc82-6434-43a6-bd3e-6e7046e1d562'
    const dispatch = useDispatch();
    const token= useSelector((state:RootState)=>state.auth.token)
console.log(folderId)
   const { data, error, isLoading } = useGetFoldersQuery({ folderId: folderId || '', token: token || '' },{ skip: false,             // Ensure the query runs
    refetchOnMountOrArgChange: true, // Always refetch when the component mounts});
   });

   // 🟢 Store Data in Redux
   useEffect(() => {
     if (data) {
       dispatch(setFoldersDataWithParent(data));
     }
   }, [data, dispatch]);
 
   // 🟢 Get Data from Redux
   const folderData = useSelector((state:RootState) => state.items.folders);
 
   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error: {`folder page`} </div>;
 

  return (
    <div>
        This is folder page and current working bucket222222222 : " " {activeBucket}
        <div className='border-2 p-4'>{JSON.stringify(folderData)}</div>
    </div>
  )
}

export default Folders2
