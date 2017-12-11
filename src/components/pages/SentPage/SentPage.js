import React from 'react'

import {PageWrapper} from '../PageWrapper'
import {MessageListPage} from '../MessageListPage'

const SentPage = () => (
  <PageWrapper title="Envoyé - Gmail">
    <MessageListPage listName='SENT'/>
  </PageWrapper>
);

export default SentPage;