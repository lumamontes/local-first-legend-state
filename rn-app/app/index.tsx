import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { observer, use$ } from '@legendapp/state/react';
import { useObservable } from '@legendapp/state/react';
import NetInfo from '@react-native-community/netinfo';
import { syncState } from "@legendapp/state"

import '../global.css';
import { postStore$ } from 'store/posts';
import { Post } from 'types/post';

const PostCard = observer(({ post }: { post: Post }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const postId = post.id as unknown as number;

  const handleUpdate = () => {
    postStore$[postId].set({
      ...postStore$[postId].get(),
      title,
      content,
    })

    setIsEditing(false);
  };

  const handleDelete = () => {
    postStore$[postId].delete();
  };

  const Button = ({ onPress, variant, children }: { onPress: () => void, variant: 'primary' | 'secondary' | 'danger' | 'warning', children: React.ReactNode }) => {
    const baseStyles = "rounded-lg px-4 py-2 active:opacity-80";
    const variants = {
      primary: "bg-blue-600 active:bg-blue-700",
      secondary: "bg-gray-100 active:bg-gray-200",
      danger: "bg-red-100 active:bg-red-200",
      warning: "bg-amber-100 active:bg-amber-200"
    };
    const textColors = {
      primary: "text-white",
      secondary: "text-gray-600",
      danger: "text-red-700",
      warning: "text-amber-700"
    };

    return (
      <Pressable onPress={onPress} className={`${baseStyles} ${variants[variant]}`}>
        <Text className={`text-center font-medium ${textColors[variant]}`}>{children}</Text>
      </Pressable>
    );
  };

  return (
    <View className="mb-6 rounded-xl bg-white p-6 shadow-lg">
      {isEditing ? (
        <View>
          <TextInput
            className="mb-3 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 text-base"
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            className="mb-4 h-24 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 text-base"
            value={content}
            onChangeText={setContent}
            placeholder="Content"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />
          <View className="flex-row justify-end space-x-3">
            <Button variant="secondary" onPress={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={handleUpdate}>
              Save Changes
            </Button>
          </View>
        </View>
      ) : (
        <View>
          <Text className="mb-2 text-xl font-semibold text-gray-900">{post.title}</Text>
          <Text className="mb-4 text-base leading-relaxed text-gray-600">{post.content}</Text>
          <View className="flex-row justify-end space-x-3">
            <Button variant="warning" onPress={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" onPress={handleDelete}>
              Delete
            </Button>
          </View>
        </View>
      )}
    </View>
  );
});

const CreatePostForm = observer(() => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const randomId = Date.now().toString(); //Adiciona um id aleatório para o post, para salvar no local (e depois salvar no backend)
    if (title && content) {
      const input = { id: randomId, title, content, author: 'Lumix'};
      postStore$.push(input);
      setTitle('');
      setContent('');
    }
  };

  return (
    <View className="mb-8 rounded-xl bg-white p-6 shadow-lg">
      <Text className="mb-4 text-2xl font-bold text-gray-900">Novo post</Text>
      <TextInput
        className="mb-3 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 text-base"
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        placeholderTextColor="#94A3B8"
      />
      <TextInput
        className="mb-4 h-32 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 text-base"
        value={content}
        onChangeText={setContent}
        placeholder="Conteúdo"
        placeholderTextColor="#94A3B8"
        multiline
        textAlignVertical="top"
      />
      <Pressable 
        onPress={handleSubmit}
        disabled={!title || !content}
        className={`rounded-lg px-4 py-3 ${!title || !content ? 'bg-gray-300' : 'bg-green-600 active:bg-green-700'}`}
      >
        <Text className="text-center text-base font-medium text-white">
          Criar post
        </Text>
      </Pressable>
    </View>
  );
});

const ConnectionStatus = observer(({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View className={`mb-6 rounded-lg p-3 ${getStatusColor()}`}>
      <Text className="text-sm font-medium">
        {status === 'online' ? '🟢 Online' : status === 'offline' ? '🟡 Offline' : '⚪ Verificando conexão...'}
        {status === 'offline' && (
          <Text className="text-yellow-700"> - Mudanças serão sincronizadas quando você ficar online</Text>
        )}
      </Text>
    </View>
  );
});

const App = observer(() => {
  const connectivityStatus$ = useObservable<string>('checking');
  const posts = use$(postStore$)
  const state$ = syncState(postStore$);
  const isLoaded = state$.isLoaded.get();
  const isError = state$.error.get();
  const error = state$.error.get();
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      connectivityStatus$.set(state.isConnected ? 'online' : 'offline');
    });

    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-12">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Posts</Text>
        </View>

        <ConnectionStatus status={connectivityStatus$.get()} />

        {isError && (
          <View className="mb-6 rounded-lg bg-red-100 p-4">
            <Text className="text-sm font-medium text-red-800">Error {error?.message}</Text>
          </View>
        )}

        {!isLoaded && (
          <View className="mb-6 rounded-lg bg-blue-100 p-4">
            <Text className="text-sm font-medium text-blue-800">Carregando posts...</Text>
          </View>
        )}

        <CreatePostForm />

        {Object.entries(posts || {}).map(([id, post]) => (
          <PostCard key={id} post={{ ...post, id }} />
        ))}

        {posts.length === 0 && (
          <View className="mb-6 rounded-lg bg-gray-100 p-4">
            <Text className="text-sm font-medium text-gray-800">Nenhum post encontrado</Text>
          </View>
        )}
        
        <View className="h-6" />
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
});

export default App;
