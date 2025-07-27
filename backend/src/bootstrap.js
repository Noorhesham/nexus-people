import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import authRouter from "./modules/Authentication/authRouter.js";
import adminRouter from "./modules/admin/adminRouter.js";
import appointmentRouter from "./modules/appointment/Appointment.Router.js";
import blogRouter from "./modules/blog/Blog.Router.js";
import brandRouter from "./modules/brands/Brands.Router.js";
import chatRouter from "./modules/chatbot/Chatbot.Router.js";
import contactRouter from "./modules/contact/Contact.Router.js";
import featureRouter from "./modules/features/Features.Router.js";
import galleryRouter from "./modules/gallery/Gallery.Router.js";
import mallRouter from "./modules/mall/Mall.Router.js";
import newsletterRouter from "./modules/newsletter/newsletter.Router.js";
import reviewRouter from "./modules/review/reviewRouter.js";
import serviceRouter from "./modules/services/Service.Router.js";
import timelineRouter from "./modules/timeline/Timeline.Router.js";
import userRouter from "./modules/user/userRouter.js";
import homeRouter from "./modules/home/Home.Router.js";
import portfolioRouter from "./modules/portfolio/Portfolio.Router.js";
import backgroundRouter from "./modules/Background/Background.Router.js";
import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {
  app.use("/backend/user", userRouter);
  app.use("/backend/auth", authRouter);
  app.use("/backend/auth/admin", adminRouter);
  app.use("/backend/reviews", reviewRouter);
  app.use("/backend/blogs", blogRouter);
  app.use("/backend/gallery", galleryRouter);
  app.use("/backend/service", serviceRouter);
  app.use("/backend/feature", featureRouter);
  app.use("/backend/contact", contactRouter);
  app.use("/backend/chatbot", chatRouter);
  app.use("/backend/brands", brandRouter);
  app.use("/backend/mall", mallRouter);
  app.use("/backend/newsletter", newsletterRouter);
  app.use("/backend/appointment", appointmentRouter);
  app.use("/backend/timeline", timelineRouter);
  app.use("/backend/home", homeRouter);
  app.use("/backend/portfolio", portfolioRouter);
  app.use("/backend/background", backgroundRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint not found", 404));
  });

  app.use(globalErrorHandler);
}
