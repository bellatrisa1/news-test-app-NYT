import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "vEJwp3nmtqMIO6FDqQwyQdjbTzJcbdAh";

interface NewsItem {
  abstract: string;
  web_url: string;
  multimedia: { url: string }[];
  pub_date: string;
  source: string;
}

interface NewsState {
  news: Record<string, NewsItem[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NewsState = {
  news: {},
  status: "idle",
  error: null,
};

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async ({ year, month }: { year: number, month: number }) => {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${API_KEY}`
    );
    return response.data.response.docs;
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.forEach((article: NewsItem) => {
          const date = article.pub_date.split("T")[0];
          if (!state.news[date]) state.news[date] = [];
          state.news[date].push(article);
        });
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Ошибка загрузки";
      });
  },
});

export const store = configureStore({
  reducer: {
    news: newsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
