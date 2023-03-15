import express, {Express, json, Request, Response, urlencoded} from "express";
import SegmentRoutes from "./routes/SegmentRoutes";

const app: Express = express();
const PORT = 5000 || process.env.PORT;

app.use(urlencoded({
    extended: false,
}));

app.use(json());

app.get("/", (req: Request, res: Response) => {
    res.json({message: "Hello World"});
});

app.use("/api/segment/", SegmentRoutes);

app.listen(PORT, () => {
    console.log(`[server]: 🚀 Server running at port: ${PORT}`);
});