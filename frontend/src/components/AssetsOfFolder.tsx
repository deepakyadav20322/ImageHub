// import { useGetAssetsOfFolderQuery } from '@/redux/apiSlice/itemsApi';
// import { RootState } from '@/redux/store';
// import { useSelector } from 'react-redux';
// import AssetList from './Assets-List-View';


// const AssetsOfFolder = ({folderId}:{folderId:string}) => {
//     const {token} = useSelector((state:RootState)=>state.auth)
// const {data} = useGetAssetsOfFolderQuery({folderId:folderId || "", token:token || ""})
//   return (
//     <div>
//   Folder Assets:
//   <div className='border-2 p-2'>
//     {/* {JSON.stringify(data,null ,2)} */}
//     <AssetList assets={data ?? []} />
//   </div>
//     </div>
//   )
// }

// export default AssetsOfFolder