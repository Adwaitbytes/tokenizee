
import React from "react";
import Layout from "@/components/layout/Layout";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Bell className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium mb-2">No notifications yet</h2>
            <p className="text-gray-500 text-center max-w-md mb-6">
              When someone interacts with your content or mentions you, you'll see it here.
            </p>
            <Button className="bg-newsweave-primary hover:bg-newsweave-secondary text-white">
              Explore content
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
