'use client'; // This is a client component 👈🏽

import React from 'react';
import CompanyTerms from 'views/CompanyTerms';
import { Layout } from 'components/core/Layout';

const CompanyTermsPage = (): JSX.Element => {
  return (
    <Layout>
      <CompanyTerms />
    </Layout>
  );
};

export default CompanyTermsPage;
