import * as admin from 'firebase-admin';
import 'firebase-functions';

admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true })
export * from './apps/backend/controllers/AddSourceNewsController';
export * from './apps/backend/controllers/ArticleSearchController';
export * from './apps/backend/controllers/bot/BotFulfillment';
export * from './apps/backend/controllers/bot/SMS';
export * from './apps/backend/controllers/Curp';
export * from './apps/backend/controllers/EmailSendController';
export * from './apps/backend/controllers/EnterpriseStoreController';
export * from './apps/backend/controllers/EnterpriseUpdateController';
export * from './apps/backend/controllers/InboxSender';
export * from './apps/backend/controllers/InvoiceCancelController';
export * from './apps/backend/controllers/NewsGeneratorController';
export * from './apps/backend/controllers/NewsGetController';
export * from './apps/backend/controllers/NotifyOrderController';
export * from './apps/backend/controllers/OffersGetController';
export * from './apps/backend/controllers/OrderCreateController';
export * from './apps/backend/controllers/PaymentServiceCreateController';
export * from './apps/backend/controllers/SubscriptionEnterpriseDeleteController';
export * from './apps/backend/controllers/SubscriptionEnterpriseStoreController';
export * from './apps/backend/controllers/TopicSubscribeController';
export * from './apps/backend/controllers/UpdateUserController';
export * from './apps/backend/controllers/UserIdentifyController';
export * from './apps/backend/controllers/UserLocateController';
export * from './apps/backend/controllers/UserStoreController';
export * from './apps/backend/controllers/WriteUserCredentials';
export * from './apps/backend/hooks/EmailSenderHook';
export * from './apps/backend/hooks/MexicanFinderHook';
export * from './apps/backend/hooks/NewUserHook';
export * from './apps/backend/hooks/searcher';
export * from './apps/backend/hooks/StorageHook';

