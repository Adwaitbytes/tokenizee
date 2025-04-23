
import Layout from "@/components/layout/Layout";

const Licenses = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Licenses</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              NewsWeave uses a variety of open source software and libraries. We are grateful to the 
              developers who have contributed to these projects. This page lists the licenses for the 
              software we use.
            </p>
            
            <h2 className="text-xl font-bold mt-6 mb-3">Open Source Licenses</h2>
            
            <div className="mb-6 border-b pb-4">
              <h3 className="font-bold text-lg mb-2">React</h3>
              <p className="text-sm mb-2">MIT License</p>
              <p className="text-sm text-gray-600">
                A JavaScript library for building user interfaces. Copyright (c) Facebook, Inc. and its affiliates.
              </p>
            </div>
            
            <div className="mb-6 border-b pb-4">
              <h3 className="font-bold text-lg mb-2">Tailwind CSS</h3>
              <p className="text-sm mb-2">MIT License</p>
              <p className="text-sm text-gray-600">
                A utility-first CSS framework. Copyright (c) Tailwind Labs, Inc.
              </p>
            </div>
            
            <div className="mb-6 border-b pb-4">
              <h3 className="font-bold text-lg mb-2">shadcn/ui</h3>
              <p className="text-sm mb-2">MIT License</p>
              <p className="text-sm text-gray-600">
                UI components built with Radix UI and Tailwind CSS. Copyright (c) shadcn.
              </p>
            </div>
            
            <div className="mb-6 border-b pb-4">
              <h3 className="font-bold text-lg mb-2">Lucide React</h3>
              <p className="text-sm mb-2">ISC License</p>
              <p className="text-sm text-gray-600">
                A beautiful and consistent icon toolkit. Copyright (c) 2020 Lucide Contributors.
              </p>
            </div>
            
            <div className="mb-6 border-b pb-4">
              <h3 className="font-bold text-lg mb-2">Zustand</h3>
              <p className="text-sm mb-2">MIT License</p>
              <p className="text-sm text-gray-600">
                A small, fast and scalable state-management solution. Copyright (c) 2019 Paul Henschel.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Recharts</h3>
              <p className="text-sm mb-2">MIT License</p>
              <p className="text-sm text-gray-600">
                A composable charting library built on React components. Copyright (c) 2015 recharts.
              </p>
            </div>
            
            <p className="mt-8 text-sm text-gray-600">
              For a complete list of licenses, please refer to the package.json file in the project repository.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Licenses;
