import {  useGetItemsOfCollectionQuery } from '@/redux/apiSlice/collectionApi'
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

const CollectionDataTable = () => {
 
  const {collectionId} = useParams();
     console.log(collectionId)
  const token  = useSelector((state:RootState)=>state.auth.token)
  const {data} = useGetItemsOfCollectionQuery({token,collectionId});
  return (
    <div>CollectionDataTable
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}

export default CollectionDataTable