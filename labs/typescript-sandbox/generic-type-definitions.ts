function identity<T>(value: T): T {
  return value
}


const num = identity<number>(42)      // T is number
const str = identity<string>("Hello") // T is string


const val = identity(true)


// Generic Interface

interface ApiResponse<T> {
  data: T,
  success: boolean,
  error?: string
}


const response: ApiResponse<string> = {
  data: "Hello",
  success: true
}

