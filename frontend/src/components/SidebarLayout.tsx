import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useGetResourcesBucketByAccountQuery } from "@/redux/apiSlice/resourceApi";
import { setResourceError, setResourceLoading, setResources, setActiveBucket } from "@/redux/features/resourceSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
 const { user,token } = useSelector((state: RootState) => state.auth);
  // here we call all required api (dispath) that for dashboard to show info
  const dispatch = useDispatch();

  const { activeBucket } = useSelector((state: RootState) => state.resource);

  // Fetch bucket resources when the component mounts
  const { data, isLoading, error } = useGetResourcesBucketByAccountQuery({ 
    accountId: user?.accountId || '', 
    access_token: token || '' 
  });
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
    if (isLoading) {
      dispatch(setResourceLoading(isLoading));
    } else if (error) {
      dispatch(setResourceError("Failed to fetch resources"));
    } else if (data && data.length > 0) {
      dispatch(setResources(data));

      // Set the first bucket as active by default, but only if no bucket is selected
      if (!activeBucket && data[0]?.resourceId) {
        dispatch(setActiveBucket(data[0].resourceId));
      }
    }
  }, [data, isLoading, error, dispatch, activeBucket]);

  const handleBucketSwitch = (bucketId: string) => {
    dispatch(setActiveBucket(bucketId));
  };
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}   onBucketSwitch={handleBucketSwitch} />

      {/* Main Content - Add margin based on sidebar state */}
      <main
        className={`flex-1 overflow-x-hidden transition-all duration-300 p-4
    ml-16 ${collapsed ? "lg:ml-16" : "lg:ml-64"}
  `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
