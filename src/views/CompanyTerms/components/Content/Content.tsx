import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const mock = [
  {
    title: '1. What information do we collect?',
    description:
      'We only collect user login details, such as email and password hash, which are used to authorize and authenticate users. No other personal information is collected or stored.'
  },
  {
    title: '2. How do we use your information?',
    description:
      'The login details we collect are solely used to authenticate and authorize user access to our services. We do not use this information for any other purpose.'
  },
  {
    title: '3. Will your information be shared with anyone?',
    description:
      'We do not share user information with any third parties. All login details are kept strictly confidential and are only used for authentication and authorization purposes within our application.'
  },
  {
    title: '4. Do we use cookies or other tracking technologies?',
    description:
      'We do not use cookies or any other tracking technologies to collect or store user information. The only data we handle are the login details provided by the users during the authentication process.'
  },
  {
    title: '5. Is your information transferred internationally?',
    description:
      'As we do not collect or store any personal information other than login details, there is no transfer of user information internationally. All data is processed and stored securely within our systems.'
  },
  {
    title: '6. How long do we keep your information?',
    description:
      'Login details are stored as long as the user maintains an account with our service. If an account is deleted, the associated login details are also permanently removed from our systems.'
  },
  {
    title: '7. What are your privacy rights?',
    description:
      'Users have the right to access their account and update their login details at any time. If users wish to delete their account, they can request account deletion, which will result in the removal of their login details from our systems.'
  },
  {
    title: '8. How can you review, update or delete the data we collect from you?',
    description:
      'Users can review and update their login details through their account settings. To delete an account and the associated login details, users can contact our support team or use the account deletion feature within the application.'
  }
];

const PrivacySection = ({ title, description }: { title: string; description: string }) => {
  return (
    <Box>
      <Typography
        variant={'h6'}
        gutterBottom
        sx={{
          fontWeight: 'medium'
        }}
      >
        {title}
      </Typography>
      <Typography component={'p'} color={'text.secondary'}>
        {description}
      </Typography>
    </Box>
  );
};

const Content = (): JSX.Element => {
  return (
    <Box>
      {mock.map((item, i) => (
        <Box key={i} marginBottom={i < mock.length - 1 ? 4 : 0}>
          <PrivacySection {...item} />
        </Box>
      ))}
    </Box>
  );
};

export default Content;
