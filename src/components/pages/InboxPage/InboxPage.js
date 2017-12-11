import React from 'react'

import {MessageListPage} from '../MessageListPage'
import {PageWrapper} from '../PageWrapper'

const InboxPage = () => (
  <PageWrapper title="Inbox - Gmail">
    <MessageListPage listName='INBOX'/>
  </PageWrapper>
);

export default InboxPage;