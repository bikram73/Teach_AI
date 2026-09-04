import { PathNode, QuizQuestion } from '../types';

export const ASSETS = {
  // Avatars & Portraits
  heroNova: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX_9roSxzw_U4CJz-GDtVlQ08bgQlbn8XfKJV1CPvcNj9kTSzhPTaWpe_Qvy2e7MnORiwj0E-mlDyzSA6Wg67yXJM8PdZxGY6i_AXZwsfpdt_fHdANekmOe5U3gglNnt_qDcEgDkF2npxs64nmGtK0aZoUMKDV3WLgrFVTI40cCs9itZ3VR1a6s6VAz5ohtZdrfEqWUEAqifPaYX5tFd8Chh80ToYWVs-p1HWfd7Bi4_wCEgE6EZFT4Q",
  studentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPpnDmtgmHsjYdF2nN9qUKf-vkxbzc3l9SgH8qzyvFvhUmHOWzQpIz40SyqJz56itoxDD7RwFCa8TrB20UVGxICGpk7k_reQL3ojxNITOYmVKJNqKOaGGFLAq1Jnt4Nxr3siUnd9b-BG8aaLy0w0_vNfyS6eYYx-TyoxydeWxbc11h4GEBP4Bv7xk7BsbYKlApK3x9KwnPvE5IwHDYd32an2aaKFPLWHy7MYqNhBR_cI47UX5PqonhQA",
  classroomNova: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpP2xLDqqbOaepmvNCbccV1ug-Y5PvGdy34uTh4fxVZ8iBGzm7J7aFvyf9JZNek7CPDbvKU1LduIwmz10Qrv1Dyb4YJEVrCQfk6RP3Tta6D38EIV4gR3kUs4-7_pC2UnZxyiBtxCND1n8bL7LNsIRKQLcaB_NKOZrO6MeqvoWnWGkxjsFvFYfwJjUftwpGTV-ctLKi6hgVzS8EOfsEqiVNht-LJ8DsGz3WsP2HOEi7F08H5ODK3ZAh3Q",
  classroomBoard: "https://lh3.googleusercontent.com/aida-public/AB6AXuC17KO7wQZWrPrE0xzrjEtB2nYu9PqEw6U8PsEBhwTHhhf3Vh0ZpTEee9wsLEaCtSDgSzosJksJA3LkRQx8Njv4zahEfwXGB24vNouZMcflaclxtDn5XfA0cx9DgprpJKMOp9SR5s-Qngv0Gw3LH0avcN7ud4xCTqLdt3GS03lL9rKPklrWyAjARxJKU6XzakWUKbAiYMTiNISLhZDx8uK14OXuJMg0M4dvuYq7iyFPbdw2S-4mULCuNw",
  attentiveNova: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvMha4Sx7Y1LJH4J2MfUBGoJ28g5JsZfNeOISD1y57Z-6cmj68bSJtLhRiYlBALo_3cuHVBzHKMKd253dmAJNlPZHGQMClShL7UxjcsqxxNEqa5-k8XXDn-ROOEJrUgxKCXLgMpg3hbveT2CXqrlMTalqhqhKSajp9aFh45dgyBbQbGcYFPicNuJWz6bX4uNGhSPnUXYbWiSte46UDSZYJ5WqayxZDJ0fwGLWut2JZ1J-H6VdvAnxY9g",
  sidebarNova: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  adaptiveNova: "https://lh3.googleusercontent.com/aida-public/AB6AXuBW97pBkuuiFMWUQDhyWZ25X7QV3ElTXPPFzvazExo81oMqY3me2iOkeBu_GqN83Q1CxKKOkJ8EtQhbCpzjMaIaTY7-QUnFwPT3G6s9P-InVy3H220Ngm1Aiyv6oss5V-BnO6wcwWj7wmP9D5uIWk-5H0Mc5Ef_8UiSrOSSmTNEEuUTcYw-54nupLUsPEh8ddYEhUCkyqFuvhGmQXOtJLHEDxSrYMk5d2p0pvaLzxEpKyLZ2PTAJO2OiQ",
  waterPipeDiagram: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZCZ5MrUv8xr-t_stR8I6Ob34Hded7YKgTtj4O7WqcRdAnNiZVYzzE9UNDZJBRIzA3Irckv9n5BR3seu2mLfWKhRqshGQrpKFkZV3rkn2y2u_lx2ggTvRK65ZOrtbZpvlwO7dcLsQYu-M-S6a19z1WjO4L-WA6Ucuwci5SPOjilhXRVVWJeSE2NBLZ-sNpNOGADE158meC1hATN_NAJpciL2yDHEQ6a7WIynJktTTBhkgpNSa5TgXmew",
  pathNova: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  progressNova: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwO9Cok69LNqyNcSHGR95PSAJ4-SrtdJfPiZ8sg38dQN0NjFO4T4eWrP4DN0uvMOHqtAh-ejMghAWIPTmmvYYKflwWHskRTwOdnkkpu0qB5QPXvLwIZBp8SDuLgsm1Mu-j7CECtSftQ3k_9pLz0Hp8JpL58cr1mkO4mOtpyQoHbsn-FZxBhJhPyL0PnuHJNBxNAu8XpZvhbLFJ0fL0lwRKnpAf9Ks-WiQDHEsN71ECFylmF9_2sG64gQ",
  studentAvatarSmall: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxyFIVLEFGfAD_w8tIAn2IUNlKxOEZKgTofJpP3JtfZY42f_lwDRzfemUnfr3313nq286jxwUdFuMvtb0B3gHaKheUpsQvchc4eF6hZvLUOLifBWNrDnTt-dN0teT0fCM9yU-d4DzAC4dOgVB5MVEJPCz1YdqSiBM5nDTnwbULo450jykked64Lxbbz23eJti5IbxAgdKDRa8t7kSm2K4QSJ8rrLiD1-alrDXBCMOqb96-MdguNsWboA"
};

export const DEFAULT_QUIZ_QUESTION: QuizQuestion = {
  subject: "PHYSICS",
  topic: "ELECTRICITY",
  question: "What happens to current when resistance increases while voltage remains constant?",
  options: [
    { key: "A", text: "Current increases" },
    { key: "B", text: "Current decreases" },
    { key: "C", text: "Current remains constant" },
    { key: "D", text: "Current becomes zero" }
  ],
  correctAnswer: "B",
  explanation: "According to Ohm's Law (I = V / R), with voltage held constant, current is inversely proportional to resistance. As resistance increases, current decreases."
};

export const LEARNING_PATH_NODES: PathNode[] = [
  {
    id: "1",
    title: "Python Fundamentals",
    status: "mastered",
    dateOrInfo: "Mastered • Dec 12",
    icon: "check"
  },
  {
    id: "2",
    title: "Data Processing",
    status: "mastered",
    dateOrInfo: "Mastered • Dec 15",
    icon: "check"
  },
  {
    id: "3",
    title: "Supervised Learning",
    status: "in_progress",
    dateOrInfo: "In Progress • 3 Lessons remaining",
    icon: "play_arrow"
  },
  {
    id: "4",
    title: "Model Evaluation",
    status: "upcoming",
    dateOrInfo: "Upcoming Module",
    icon: "lock"
  },
  {
    id: "5",
    title: "Neural Networks",
    status: "upcoming",
    dateOrInfo: "Upcoming Module",
    icon: "hub"
  }
];
