// import React from "react";

// const ProfilePage = () => {
//   const user = {
//         name: "Valentino Rossi",
//         email: "valentinorossi@example.com",
//         bio: "Vendedor en ByCarket desde 2021.",
//         avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRetCtNsfwuticad2uh7IchEA29bdsxBpENJw&s",
//         location: "Italia, Tavullia",
//         joined: "Enero 2021",
//         stats: {
//             listings: 12,
//             sold: 7,
//             favorites: 18
//         }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-20">

//                     <div className="bg-[#103663] backdrop-blur-md shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
//                         <img
//                             src={user.avatarUrl}
//                             alt="Foto de perfil"
//                             className="w-32 h-32 rounded-full object-cover border-4 border-[#103663]"
//                         />
//                         <div className="flex-1 text-white">
//                             <h2 className="text-2xl font-bold">{user.name}</h2>
//                             <p className="text-sm opacity-80 mb-2">{user.email}</p>
//                             <p className="mb-4">{user.bio}</p>
//                             <div className="text-sm opacity-80 space-y-1">
//                                 <p>📍 {user.location}</p>
//                                 <p>📅 Miembro desde {user.joined}</p>
//                             </div>
//                             <div className="mt-4 flex gap-2">
//                                 <button className="px-4 py-2 bg-[#4A77A8] border border-solid text-white rounded-xl hover:bg-[#103663] transition">
//                                     Editar perfil
//                                 </button>
//                                 <button className="px-4 py-2 bg-[#4A77A8] border border-solid text-white rounded-xl hover:bg-[#103663] transition">
//                                     Publicar auto
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
    
//     </div>
//   );
// };

// export default ProfilePage;