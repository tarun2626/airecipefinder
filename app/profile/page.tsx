import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserProfile } from "@/lib/user"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const user = await getUserProfile(session.user.id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>
      
      <div className="bg-gray-800 shadow rounded-lg p-6 mb-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">Personal Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium text-gray-300">Name:</span> <span className="text-white">{user.name}</span></p>
          <p><span className="font-medium text-gray-300">Email:</span> <span className="text-white">{user.email}</span></p>
        </div>
      </div>

      {user.preferences && (
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white">Dietary Preferences</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-gray-300">Diet Types:</h3>
              <div className="flex flex-wrap gap-2">
                {user.preferences.dietaryType.map((diet) => (
                  <span key={diet} className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm">
                    {diet}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-gray-300">Allergies:</h3>
              <div className="flex flex-wrap gap-2">
                {user.preferences.allergies.map((allergy) => (
                  <span key={allergy} className="px-3 py-1 bg-red-900 text-red-100 rounded-full text-sm">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 shadow rounded-lg p-6 mb-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">Saved Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.savedRecipes.map((recipe) => (
            <div key={recipe.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
              {recipe.imageUrl && (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name} 
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-medium text-white">{recipe.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">Shopping Lists</h2>
        <div className="space-y-4">
          {user.shoppingLists.map((list) => (
            <div key={list.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
              <h3 className="font-medium mb-2 text-white">{list.name}</h3>
              <ul className="list-disc list-inside">
                {list.items.map((item) => (
                  <li key={item.id} className={item.checked ? 'line-through text-gray-500' : 'text-gray-300'}>
                    {item.name} {item.quantity && `(${item.quantity})`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

