import { icons } from "@/constants/icons";
import { useFetch } from "@/hooks/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({
  label, value
}: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">
      {label}
    </Text>
    <Text className="text-light-100 font-bold text-sm">
      {value || "N/A"}
    </Text>
  </View>
)

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const {
    data: movieDetails,
  } = useFetch(() => fetchMovieDetails({ id: id as string }), true, [id]);

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{
        paddingBottom: 100,
      }}>
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}` }}
            className="w-full h-[550px] rounded-lg"
            resizeMode="stretch"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movieDetails?.title}</Text>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movieDetails?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">
              {movieDetails?.runtime} min
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round((movieDetails?.vote_average ?? 0) / 2)}
            </Text>
            <Text className="text-light-200 text-sm">
              {movieDetails?.vote_count} votes
            </Text>
          </View>

          <MovieInfo label="Overview" value={movieDetails?.overview} />
          <MovieInfo label="Genre" value={movieDetails?.genres?.map((genre) => genre.name).join(" - ") || "N/A"} />

          <View className="flex flex-row justify-between w-full">
            <MovieInfo label="Budget" value={`$${movieDetails?.budget || 0 / 1_000_000} million`} />
            <MovieInfo label="Revenue" value={`$${Math.round(movieDetails?.revenue || 0 / 1_000_000)}`} />
          </View>

          <MovieInfo label="Production Companies" value={movieDetails?.production_companies?.map((company) => company.name).join(" - ") || "N/A"} />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={() => router.push("/")}
      >
        <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
        <Text className="text-white font-semibold text-base">
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
MovieDetails.displayName = "MovieDetails";