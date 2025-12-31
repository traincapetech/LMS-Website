import React, { useEffect, useState } from "react";
import { useStore } from "@/Store/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

const AdminNewsletterDetail = () => {
  const { fetchSubscribers, subscribers, unSubscribe } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // Filter subscribers based on search query
  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen mt-20">
      <div className="text-center font-poppins">
        <h1 className="text-4xl font-semibold mb-20">
          All NewsLetter Subscribers
        </h1>
      </div>
      <div className="flex justify-center mb-20">
        <div className="relative w-1/2">
          <FiSearch className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
          <Input
            placeholder="Search for email..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((sub, index) => (
            <Card key={index} className="p-4">
              <h1 className="text-base font-semibold">{sub.email}</h1>
              <p className="text-sm text-gray-600 mb-2">
                {sub.subscribedAt
                  ? new Date(sub.subscribedAt).toDateString()
                  : "N/A"}
              </p>
              <Button
                variant="destructive"
                onClick={() => unSubscribe(sub.email)}
              >
                Unsubscribe
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            {searchQuery
              ? "No subscribers found matching your search."
              : "No subscribers yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletterDetail;
