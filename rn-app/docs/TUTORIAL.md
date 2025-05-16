# Building a Local-First App with Legend State

Local-First é um conceito muito popular no desenvolvimento de aplicações modernas, oferecendo uma excelente experiência para o usuário. Em essência, trata-se de aplicar um conceito simples: todas as ações são "cacheadas" localmente antes de serem sincronizadas com o backend, permitindo que o app funcione mesmo offline.

Isso gera alguns desafios de implementação:
- Como lidar com o status de conectividade do usuário?
- Como realizar a sincronização com o backend quando voltar online?
- Como implementar tudo isso de forma robusta e sem muito boilerplate?

Felizmente, existem soluções modernas que facilitam a implementação do Local-First em apps React Native. Neste tutorial, vamos explorar o Legend State, uma biblioteca poderosa e performática para gerenciamento de estado local e remoto.

O Legend State é extremamente rápido ([veja os benchmarks](https://legendapp.com/open-source/state/v3/intro/introduction/#2-%EF%B8%8F-the-fastest-react-state-library)) e oferece um sistema robusto de sincronização que funciona com qualquer backend.

## Conceitos Importantes

O Legend State utiliza um conceito de "reatividade" que pode ser diferente do que você está acostumado no React. Recomendo ler a documentação oficial sobre:

- [Introduction](https://legendapp.com/open-source/state/v3/intro/introduction/)
- [Fine Grained Reactivity](https://legendapp.com/open-source/state/v3/concepts/fine-grained/)

## Implementação

Vamos criar um app de posts que funciona offline-first, com sincronização automática quando online. Primeiro, vamos configurar nossa store:

\`\`\`typescript
// store/posts.ts
import { observable } from '@legendapp/state';
import { syncCrud } from '@legendapp/state/sync-plugins/crud';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { Platform } from 'react-native';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Configuração do store com syncCrud
export const postStore$ = observable(syncCrud({
  name: 'posts',
  initial: [] as Post[],
  list: getPosts,    // GET /api/posts
  create: createPost, // POST /api/posts
  update: updatePost, // PUT /api/posts/{id}
  delete: deletePost, // DELETE /api/posts/{id}
  persist: {
    name: 'posts',
    // Usa localStorage na web e MMKV no mobile
    plugin: Platform.OS === 'web' ? ObservablePersistLocalStorage : ObservablePersistMMKV,
  },
  retry: {
    infinite: true, // Continua tentando em caso de erro
  },
  syncMode: 'auto',
  fieldUpdatedAt: 'updatedAt',
  fieldCreatedAt: 'createdAt',
  onSavedUpdate: true,
}));
\`\`\`

O componente principal do app mostra como usar o store e lidar com conectividade:

\`\`\`typescript
// App.tsx
const App = observer(() => {
  const connectivityStatus$ = useObservable<string>('checking');
  const state$ = syncState(postStore$);
  const isLoaded = state$.isLoaded.get();
  const isError = state$.isError.get();
  const posts = postStore$.get();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      connectivityStatus$.set(state.isConnected ? 'online' : 'offline');
    });
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        <Text>Status: {connectivityStatus$.get()}</Text>
        {connectivityStatus$.get() === 'offline' && (
          <Text>Changes will sync when back online</Text>
        )}

        <CreatePostForm />
        
        {posts?.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
});
\`\`\`

## Funcionalidades

1. **Persistência Cross-Platform**: 
   - Web: LocalStorage
   - Mobile: MMKV

2. **Sincronização Automática**:
   - Mudanças são salvas localmente primeiro
   - Sincronização automática quando online
   - Retry infinito para garantir que nada se perca

3. **UI Responsiva**:
   - Feedback imediato para o usuário
   - Indicador de status de conexão
   - Loading e error states

4. **CRUD Completo**:
   - Create: Cria posts mesmo offline
   - Read: Lista posts do cache local
   - Update: Atualiza posts com sync automático
   - Delete: Remove posts com sync quando online

## Conclusão

Com o Legend State, implementamos um app Local-First robusto com poucas linhas de código. A biblioteca cuida de toda a complexidade de sincronização, persistência e gerenciamento de estado, permitindo que focemos na experiência do usuário.

Recursos úteis:
- [Legend State Docs](https://legendapp.com/open-source/state/)
- [Sync Plugins](https://legendapp.com/open-source/state/v3/sync/persist-sync/)
- [CRUD Plugin](https://legendapp.com/open-source/state/v3/sync/crud/)




