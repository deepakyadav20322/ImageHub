import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useGetResourcesBucketByAccountQuery } from "@/redux/apiSlice/resourceApi";
import { setResourceError, setResourceLoading, setResources, setActiveBucket } from "@/redux/features/resourceSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetRootFolderOfBucketQuery } from "@/redux/apiSlice/itemsApi";
import { setBucketRoootFolder } from "@/redux/features/itemsSlice";
import BrandLoadingScreen from '@/components/BrandLoadingScreen'
import { useIsMobile } from "@/hooks/use-mobile";
const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
 const { user,token } = useSelector((state: RootState) => state.auth);
  // here we call all required api (dispath) that for dashboard to show info
  const dispatch = useDispatch();

  const { activeBucket } = useSelector((state: RootState) => state.resource);

  // Fetch bucket resources when the component mounts
  const { data, isLoading,isFetching, error } = useGetResourcesBucketByAccountQuery({ 
    accountId: user?.accountId || '', 
    access_token: token || '' 
  });

  // we get the root folder of specsfic bucket----
  const { data: rootFolderData } = useGetRootFolderOfBucketQuery(
    {
      bucketId: activeBucket ,
      token: token || ''}
  );
  
  // console.log(token)
console.log("from bucket layout: ",data)
  // useEffect(() => {
  //   if (isLoading) {
  //     dispatch(setResourceLoading(isLoading)); 
  //   } else if (error) {
  //     dispatch(setResourceError("Failed to fetch resources"));
  //   } else if (data) {
  //     dispatch(setResources(data));
  //   }
  //   // 👉Todo: Add any tracker that users active bucket which work like default (add some flag or ...)
  //   // initially we set the first bucket by default 
  //   dispatch(setActiveBucket(data && data[0].resourceId))
  // }, [data, isLoading, error, dispatch]);

  // const handleBucketSwitch = (bucketId:string) => {
  //   dispatch(setActiveBucket(bucketId));
  // };

  useEffect(() => {
    if (isLoading){
      dispatch(setResourceLoading(isLoading));
    } else if (error) {
      dispatch(setResourceError("Failed to fetch resources"));
    } else if (data && data.length > 0) {
      dispatch(setResources(data));
     

      // Set the first bucket as active by default, but only if no bucket is selected
      if (!activeBucket && data[0]?.resourceId) {
        dispatch(setActiveBucket(data[0].resourceId));
      }
      // here we set root folder Data of current active bucket
      dispatch(setBucketRoootFolder(rootFolderData));
    }
  }, [data, isLoading, error, dispatch, activeBucket,rootFolderData]);

  const handleBucketSwitch = (bucketId: string) => {
    dispatch(setActiveBucket(bucketId));
  };
  const isMobile = useIsMobile()
  
  if (isLoading || isFetching) return <BrandLoadingScreen/>;
  if (error) return <p>Error fetching data</p>;
  return (
<div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onBucketSwitch={handleBucketSwitch} />

      {/* Main Content with Context */}
      <main
        className={`flex-1 overflow-x-hidden transition-all duration-200
        ${collapsed ? "lg:ml-16" : "lg:ml-64"}
        `}
      >
    
          {/* Pass collapsed state to children */}
          <Outlet context={{ collapsed }} />
     
      </main>
    </div>
);
};

export default SidebarLayout;
