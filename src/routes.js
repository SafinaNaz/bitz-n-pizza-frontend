// importing layout
import Layout1 from "./layouts/layout_1";
import Layout2 from "./layouts/layout_2";

// importing all the themes
import ThemeOne from "./themes/theme-one";
import ExploreOne from "./themes/explore-one";
import ExploreTwo from "./themes/explore-two";
import ExploreThree from "./themes/explore-three";
import ExploreFour from "./themes/explore-four";
import Auctions from "./themes/auctions";
import ItemDetails from "./themes/item-details";
import Marketplace from "./themes/marketplace";
import MyWallet from "./themes/my-wallet";
import Blog from "./themes/blog";
import BlogSingle from "./themes/blog-single";
import HelpCenter from "./themes/help-center";
import Authors from "./themes/authors";
import Author from "./themes/author";
import WalletConnect from "./themes/wallet-connect";
import Create from "./themes/create";
import PizzaCave from "./themes/pizzacave";
import Artist from "./components/Artist/Artist";
import Faq from "./components/Faq/Faq"
import Rewards from "./components/Rewards/Rewards";
import RewardDetail from "./components/RewardDetail/RewardDetail";
import HowToCreate from "./components/HowToCreate/HowToCreate";
import PizzaDetail from "./components/Pizza/pizza-detail"
const routes = [
    {
        path: "/",
        layout: Layout1,
        access: true,
        exact: true,
        component: ThemeOne
    },
    {
        path: "/faq",
        layout: Layout1,
        access: true,
        exact: true,
        component: Faq
    },
    {
        path: "/explore-1",
        layout: Layout2,
        title: "Explore",
        subpage: "Explore",
        page: "Explore Style 1",
        access: true,
        exact: true,
        component: ExploreOne
    },
    {
        path: "/explore-2",
        layout: Layout2,
        title: "Explore",
        subpage: "Explore",
        page: "Explore Style 2",
        access: true,
        exact: true,
        component: ExploreTwo
    },
    {
        path: "/explore-3",
        layout: Layout2,
        title: "Explore",
        subpage: "Explore",
        page: "Explore Style 3",
        access: true,
        exact: true,
        component: ExploreThree
    },
    {
        path: "/explore-4",
        layout: Layout2,
        title: "Explore",
        subpage: "Explore",
        page: "Explore Style 4",
        access: true,
        exact: true,
        component: ExploreFour
    },
    {
        path: "/auctions",
        layout: Layout2,
        title: "Auctions",
        subpage: "Explore",
        page: "Live Auctions",
        access: true,
        exact: true,
        component: Auctions
    },
    {
        path: "/item-details",
        layout: Layout2,
        title: "Item Details",
        subpage: "Explore",
        page: "Item Details",
        access: true,
        exact: true,
        component: ItemDetails
    },
    {
        path: "/marketplace",
        layout: Layout1,
        access: true,
        exact: true,
        component: Marketplace
    },
    {
        path: "/my-wallet",
        layout: Layout1,
        access: true,
        exact: true,
        component: MyWallet
    },
    {
        path: "/blog",
        layout: Layout2,
        title: "Blog",
        subpage: "Community",
        page: "Blog",
        access: true,
        exact: true,
        component: Blog
    },
    {
        path: "/blog-single",
        layout: Layout2,
        title: "Blog Single",
        subpage: "Community",
        page: "Blog Single",
        access: true,
        exact: true,
        component: BlogSingle
    },
    {
        path: "/help-center",
        layout: Layout2,
        title: "Help Center",
        subpage: "Community",
        page: "Help Center",
        access: true,
        exact: true,
        component: HelpCenter
    },
    {
        path: "/authors",
        layout: Layout2,
        title: "Authors",
        subpage: "Pages",
        page: "Authors",
        access: true,
        exact: true,
        component: Authors
    },
    {
        path: "/author",
        layout: Layout2,
        title: "Author Profile",
        subpage: "Pages",
        page: "Author",
        access: true,
        exact: true,
        component: Author
    },
    {
        path: "/wallet-connect",
        layout: Layout2,
        title: "Wallet Connect",
        subpage: "Pages",
        page: "Wallet Connect",
        access: true,
        exact: true,
        component: WalletConnect
    },
    {
        path: "/create",
        layout: Layout2,
        title: "Create",
        subpage: "Pages",
        page: "Create",
        access: true,
        exact: true,
        component: Create
    },
    {
        path: "/pizzacave",
        layout: Layout1,
        access: true,
        exact: true,
        component: PizzaCave
    },
    {
        path: "/artist",
        layout: Layout1,
        access: true,
        exact: true,
        component: Artist
    },
    {
        path: "/rarity-rewards",
        layout: Layout1,
        access: true,
        exact: true,
        component: Rewards
    },
    {
        path: "/reward-detail",
        layout: Layout1,
        access: true,
        exact: true,
        component: RewardDetail
    },
    {
        path: "/how-to-create",
        layout: Layout1,
        access: true,
        exact: true,
        component: HowToCreate
    },
    {
        path: "/pizza/:id",
        layout: Layout1,
        access: true,
        exact: true,
        component: PizzaDetail
    }
]

export default routes;